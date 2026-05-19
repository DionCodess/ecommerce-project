import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Product } from '../domain';
import type { CartPageProps } from './PageProps';

export function ProductDetailsPage({ setCart, services }: CartPageProps) {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!productId) {
      return;
    }

    void services.productService.getProduct(productId).then(setProduct);
  }, [productId, services]);

  if (!product) {
    return (
      <section className="page-stack">
        <p>Product not found.</p>
        <Link to="/">Back to shop</Link>
      </section>
    );
  }

  return (
    <section className="details-layout">
      <img src={product.imageUrl} alt={product.name} />
      <div className="page-stack">
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <strong className="price">{product.price.format()}</strong>
        <p>{product.inventoryCount} units in stock</p>
        <div className="button-row">
          <button type="button" onClick={() => setCart((cart) => services.cartService.addProduct(cart, product))}>
            Add to cart
          </button>
          <Link className="secondary-button" to="/cart">
            View cart
          </Link>
        </div>
      </div>
    </section>
  );
}
