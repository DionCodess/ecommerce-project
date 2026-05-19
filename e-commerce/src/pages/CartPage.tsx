import { Link } from 'react-router-dom';
import { CartLineItem } from '../components/cart/CartLineItem';
import type { CartPageProps } from './PageProps';

export function CartPage({ cart, setCart, services }: CartPageProps) {
  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Shopping cart</p>
          <h1>Your cart</h1>
        </div>
        <strong className="price">{cart.total().format()}</strong>
      </div>

      {cart.isEmpty() ? (
        <div className="panel">
          <p>Your cart is empty.</p>
          <Link to="/">Continue shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.items().map((item) => (
              <CartLineItem
                key={item.productId}
                item={item}
                onQuantityChange={(productId, quantity) =>
                  setCart((currentCart) => services.cartService.updateQuantity(currentCart, productId, quantity))
                }
                onRemove={(productId) =>
                  setCart((currentCart) => services.cartService.removeProduct(currentCart, productId))
                }
              />
            ))}
          </div>
          <div className="button-row">
            <Link className="secondary-button" to="/">
              Continue shopping
            </Link>
            <Link className="button-link" to="/checkout">
              Checkout
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
