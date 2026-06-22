import { useEffect, useState } from 'react';
import { ProductCard } from '../components/products/ProductCard';
import type { Product, ProductCategory } from '../domain';
import type { CartPageProps } from './PageProps';

type CategoryFilter = ProductCategory | 'all';

export function StorefrontPage({ setCart, services }: CartPageProps) {
  const [products, setProducts] = useState<readonly Product[]>([]);
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [recommendation, setRecommendation] = useState<string>('');

  useEffect(() => {
    void services.productService
      .getAvailableProducts({ query, category })
      .then((nextProducts) => {
        setProducts(nextProducts);
        setRecommendation(services.aiShoppingAssistant.createRecommendation(nextProducts, query));
      });
  }, [category, query, services]);

  function handleAddToCart(product: Product): void {
    setCart((cart) => services.cartService.addProduct(cart, product));
  }

  return (
    <section className="page-stack">
      <div className="hero">
        <div>
          <p className="eyebrow">CS491 portfolio project</p>
          <h1>Sustainable marketplace with dummy checkout</h1>
          <p>
            Browse responsible products, manage a cart, and complete a simulated payment flow backed by an
            OOP TypeScript application design.
          </p>
        </div>

        <div className="sdg-banner">
          <h3>UN Sustainable Development Goal 12</h3>
          <p>
            This project connects to Responsible Consumption and Production by encouraging sustainable
            shopping choices, reusable products, and environmentally conscious purchasing habits.
          </p>
        </div>

        <aside className="assistant-card">
          <strong>AI shopping assistant</strong>
          <p>{recommendation}</p>
        </aside>
      </div>

      <div className="toolbar">
        <input
          aria-label="Search products"
          placeholder="Search products"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(event) => setCategory(event.target.value as CategoryFilter)}
        >
          <option value="all">All categories</option>
          <option value="electronics">Electronics</option>
          <option value="apparel">Apparel</option>
          <option value="home">Home</option>
          <option value="books">Books</option>
          <option value="fitness">Fitness</option>
        </select>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </section>
  );
}