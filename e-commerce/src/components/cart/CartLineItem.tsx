import type { CartItem } from '../../domain';

interface CartLineItemProps {
  readonly item: CartItem;
  readonly onQuantityChange: (productId: string, quantity: number) => void;
  readonly onRemove: (productId: string) => void;
}

export function CartLineItem({ item, onQuantityChange, onRemove }: CartLineItemProps) {
  return (
    <article className="cart-line">
      <img src={item.imageUrl} alt={item.productName} />
      <div>
        <h3>{item.productName}</h3>
        <p>{item.unitPrice.format()} each</p>
      </div>
      <label>
        Quantity
        <input
          min="1"
          type="number"
          value={item.quantity}
          onChange={(event) => onQuantityChange(item.productId, Number(event.target.value))}
        />
      </label>
      <strong>{item.subtotal().format()}</strong>
      <button type="button" className="secondary-button" onClick={() => onRemove(item.productId)}>
        Remove
      </button>
    </article>
  );
}
