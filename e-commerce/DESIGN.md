# Design Document

This document records the main design choices and UML diagrams for the CS491 e-commerce web app. The implementation is TypeScript-first and object-oriented, with React used as the UI layer.

## Design Goals

- Keep business logic out of React components.
- Use strict TypeScript with no implicit or explicit `any`.
- Model the domain with classes so behavior is close to the data it protects.
- Use repositories to isolate persistence from application logic.
- Make deployment reproducible through committed Firebase and GitHub Actions config.
- Keep the app usable in local demo mode without Firebase credentials.

## High-Level Architecture

```mermaid
flowchart TD
  Shopper["Shopper"] --> StorefrontPage["StorefrontPage"]
  Shopper --> CartPage["CartPage"]
  Shopper --> CheckoutPage["CheckoutPage"]
  Admin["Admin"] --> AdminDashboardPage["AdminDashboardPage"]
  StorefrontPage --> ProductService["ProductService"]
  CartPage --> CartService["CartService"]
  CheckoutPage --> CheckoutService["CheckoutService"]
  AdminDashboardPage --> AdminService["AdminService"]
  AdminDashboardPage --> AdminAuthService["AdminAuthService"]
  ProductService --> ProductRepository["ProductRepository"]
  CheckoutService --> OrderRepository["OrderRepository"]
  AdminService --> ProductRepository
  AdminService --> OrderRepository
  ProductRepository --> Firestore["Firestore"]
  OrderRepository --> Firestore
  AdminAuthService --> FirebaseAuth["Firebase Auth"]
```



## Class Diagram

```mermaid
classDiagram
  class Money {
    +amountInCents number
    +currency string
    +add(other) Money
    +multiply(quantity) Money
    +format() string
  }

  class Product {
    +id string
    +name string
    +description string
    +category ProductCategory
    +imageUrl string
    +price Money
    +inventoryCount number
    +isActive boolean
    +featured boolean
    +isInStock() boolean
    +matchesSearch(query) boolean
    +toSnapshot() ProductSnapshot
  }

  class CartItem {
    +productId string
    +productName string
    +unitPrice Money
    +imageUrl string
    +quantity number
    +withQuantity(quantity) CartItem
    +subtotal() Money
    +toSnapshot() CartItemSnapshot
  }

  class Cart {
    -itemsByProductId Map
    +addProduct(product, quantity) Cart
    +updateQuantity(productId, quantity) Cart
    +removeProduct(productId) Cart
    +clear() Cart
    +items() CartItem[]
    +itemCount() number
    +total() Money
    +isEmpty() boolean
  }

  class Order {
    +id string
    +items CartItem[]
    +customer CustomerDetails
    +status OrderStatus
    +total Money
    +createdAt Date
    +withStatus(status) Order
    +toSnapshot() OrderSnapshot
  }

  class UserProfile {
    +id string
    +displayName string
    +email string
    +role UserRole
    +isAdmin() boolean
    +toSnapshot() UserProfileSnapshot
  }

  Product --> Money
  CartItem --> Money
  CartItem --> Product
  Cart --> CartItem
  Order --> CartItem
  Order --> Money
```



## Service And Repository Diagram

```mermaid
classDiagram
  class ProductRepository {
    <<interface>>
    +listProducts() Promise
    +getProductById(productId) Promise
    +saveProduct(product) Promise
    +deleteProduct(productId) Promise
  }

  class OrderRepository {
    <<interface>>
    +listOrders() Promise
    +getOrderById(orderId) Promise
    +saveOrder(order) Promise
  }

  class ProductService {
    -productRepository ProductRepository
    +getAvailableProducts(filter) Promise
    +getProduct(productId) Promise
    +listAllProducts() Promise
    +saveFromInput(input) Promise
    +deleteProduct(productId) Promise
  }

  class CartService {
    +addProduct(cart, product, quantity) Cart
    +updateQuantity(cart, productId, quantity) Cart
    +removeProduct(cart, productId) Cart
    +clear(cart) Cart
  }

  class CheckoutService {
    -orderRepository OrderRepository
    +completeDummyPayment(cart, customer) Promise
  }

  class AdminService {
    -productRepository ProductRepository
    -orderRepository OrderRepository
    +getDashboardMetrics() Promise
    +updateOrderStatus(orderId, status) Promise
  }

  class AdminAuthService {
    -auth Auth
    +currentSession() AdminSession
    +signIn(email, password) Promise
    +signOut() Promise
  }

  ProductService --> ProductRepository
  CheckoutService --> OrderRepository
  AdminService --> ProductRepository
  AdminService --> OrderRepository
```



## Checkout Sequence

```mermaid
sequenceDiagram
  actor Shopper
  participant StorefrontPage
  participant CartService
  participant CheckoutPage
  participant CheckoutService
  participant OrderRepository
  participant Firestore

  Shopper->>StorefrontPage: Add product to cart
  StorefrontPage->>CartService: addProduct(cart, product)
  CartService-->>StorefrontPage: Updated Cart
  Shopper->>CheckoutPage: Submit customer details
  CheckoutPage->>CheckoutService: completeDummyPayment(cart, customer)
  CheckoutService->>OrderRepository: saveOrder(order)
  OrderRepository->>Firestore: Write order document
  Firestore-->>OrderRepository: Saved
  OrderRepository-->>CheckoutService: Saved
  CheckoutService-->>CheckoutPage: Confirmed Order
  CheckoutPage-->>Shopper: Order confirmation
```



## Admin Product Management Sequence

```mermaid
sequenceDiagram
  actor Admin
  participant AdminDashboardPage
  participant AdminAuthService
  participant ProductService
  participant ProductRepository
  participant FirestoreRules
  participant Firestore

  Admin->>AdminDashboardPage: Sign in
  AdminDashboardPage->>AdminAuthService: signIn(email, password)
  AdminAuthService-->>AdminDashboardPage: AdminSession
  Admin->>AdminDashboardPage: Save product
  AdminDashboardPage->>ProductService: saveFromInput(input)
  ProductService->>ProductRepository: saveProduct(product)
  ProductRepository->>FirestoreRules: Validate admin permission
  FirestoreRules->>Firestore: Allow product write
  Firestore-->>ProductRepository: Saved
  ProductRepository-->>ProductService: Saved
  ProductService-->>AdminDashboardPage: Product saved
```



## Firebase Deployment Flow

```mermaid
flowchart TD
  Developer["Developer"] --> GitHub["GitHub Repository"]
  GitHub --> GitHubActions["GitHub Actions"]
  GitHubActions --> Typecheck["npm run typecheck"]
  Typecheck --> Lint["npm run lint"]
  Lint --> Tests["npm run test"]
  Tests --> Build["npm run build"]
  Build --> FirebaseDeploy["firebase deploy"]
  FirebaseDeploy --> FirebaseHosting["Firebase Hosting"]
  FirebaseDeploy --> FirestoreRules["Firestore Rules"]
  FirebaseDeploy --> FirestoreIndexes["Firestore Indexes"]
```



## Data Model

```mermaid
erDiagram
  PRODUCT {
    string id
    string name
    string description
    string category
    string imageUrl
    number priceInCents
    number inventoryCount
    boolean isActive
    boolean featured
  }

  ORDER {
    string id
    string status
    number totalInCents
    string createdAtIso
  }

  ORDER_ITEM {
    string productId
    string productName
    number unitPriceInCents
    string imageUrl
    number quantity
  }

  USER_PROFILE {
    string id
    string displayName
    string email
    string role
  }

  ORDER ||--|{ ORDER_ITEM : contains
  USER_PROFILE ||--o{ ORDER : administers
```



## Design Choices

### Object-Oriented Domain Model

The core shopping behavior is implemented with domain classes. `Cart` owns cart changes and totals, `Order` owns order creation/status snapshots, and `Money` owns currency-safe arithmetic. This keeps business rules testable without rendering React components.

### Repository Pattern

Services depend on `ProductRepository` and `OrderRepository` interfaces instead of Firebase directly. This allows two runtime modes:

- Local demo mode through `InMemoryProductRepository` and `InMemoryOrderRepository`.
- Firebase-backed mode through `FirestoreProductRepository` and `FirestoreOrderRepository`.

### React As UI Layer

React components handle rendering, inputs, routing, and event handling. Business actions are delegated to service classes. This keeps pages readable and makes UML diagrams match the implementation.

### Firebase-Only Deployment

Firebase Hosting, Firestore rules, Firestore indexes, environment placeholders, seed script, and GitHub Actions deployment are committed to the repository. The only manual setup is project creation, enabling Firebase services, and adding secrets.

### Dummy Payment

The checkout intentionally avoids real payment APIs. `CheckoutService.completeDummyPayment` creates a paid order after customer details are submitted. This satisfies the course project requirement without introducing PCI/security risk.

### AI Feature Without Paid API Dependency

`AiShoppingAssistant` provides a simple recommendation message from current catalog data. It demonstrates an AI-style feature while keeping the core application functional without external AI credentials.

## Testing Strategy

- `Cart.test.ts`: verifies cart item counts, quantity updates, and totals.
- `CheckoutService.test.ts`: verifies dummy checkout creates a paid order through the repository interface.
- `InMemoryProductRepository.test.ts`: verifies repository save/read behavior with typed `Product` objects.

Future tests should cover Firestore snapshot mapping, admin status changes, product validation errors, and UI workflows with React Testing Library.