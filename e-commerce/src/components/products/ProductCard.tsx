import { Link } from 'react-router-dom';
import type { Product } from '../../domain';

interface ProductCardProps {
  readonly product: Product;
  readonly onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <div className="product-card-body">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="card-footer">
          <strong>{product.price.format()}</strong>
          <span>{product.inventoryCount} in stock</span>
        </div>
        <div className="button-row">
          <Link className="secondary-button" to={`/products/${product.id}`}>
            Details
          </Link>
          <button type="button" onClick={() => onAddToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
