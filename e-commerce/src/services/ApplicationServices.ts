import { FirebaseClient } from '../config/firebaseConfig';
import {
  FirestoreOrderRepository,
  FirestoreProductRepository,
  InMemoryOrderRepository,
  InMemoryProductRepository,
  type OrderRepository,
  type ProductRepository,
} from '../repositories';
import { AdminAuthService } from './AdminAuthService';
import { AdminService } from './AdminService';
import { AiShoppingAssistant } from './AiShoppingAssistant';
import { CartService } from './CartService';
import { CheckoutService } from './CheckoutService';
import { ProductService } from './ProductService';

export class ApplicationServices {
  public readonly productService: ProductService;
  public readonly cartService: CartService;
  public readonly checkoutService: CheckoutService;
  public readonly adminService: AdminService;
  public readonly adminAuthService: AdminAuthService;
  public readonly aiShoppingAssistant: AiShoppingAssistant;

  public constructor() {
    const runtime = this.createRuntimeDependencies();

    this.productService = new ProductService(runtime.productRepository);
    this.cartService = new CartService();
    this.checkoutService = new CheckoutService(runtime.orderRepository);
    this.adminService = new AdminService(runtime.productRepository, runtime.orderRepository);
    this.adminAuthService = new AdminAuthService(runtime.firebaseClient?.auth ?? null);
    this.aiShoppingAssistant = new AiShoppingAssistant();
  }

  private createRuntimeDependencies(): {
    readonly productRepository: ProductRepository;
    readonly orderRepository: OrderRepository;
    readonly firebaseClient: FirebaseClient | null;
  } {
    if (import.meta.env.VITE_USE_FIREBASE === 'true') {
      const firebaseClient = new FirebaseClient();
      return {
        productRepository: new FirestoreProductRepository(firebaseClient.firestore),
        orderRepository: new FirestoreOrderRepository(firebaseClient.firestore),
        firebaseClient,
      };
    }

    return {
      productRepository: new InMemoryProductRepository(),
      orderRepository: new InMemoryOrderRepository(),
      firebaseClient: null,
    };
  }
}

export const applicationServices = new ApplicationServices();
