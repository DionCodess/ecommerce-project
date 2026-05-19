import { useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import type { CustomerDetails, Order } from '../domain';
import type { CartPageProps } from './PageProps';

export function CheckoutPage({ cart, setCart, services }: CartPageProps) {
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    address: '',
  });
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>): void {
    event.preventDefault();
    void services.checkoutService.completeDummyPayment(cart, customer).then((order) => {
      setCompletedOrder(order);
      setCart((currentCart) => services.cartService.clear(currentCart));
    });
  }

  if (completedOrder) {
    return (
      <section className="panel page-stack">
        <p className="eyebrow">Dummy payment approved</p>
        <h1>Order confirmed</h1>
        <p>
          Order <strong>{completedOrder.id}</strong> was created for {completedOrder.total.format()}.
        </p>
        <Link className="button-link" to="/">
          Back to shop
        </Link>
      </section>
    );
  }

  if (cart.isEmpty()) {
    return (
      <section className="panel page-stack">
        <h1>Checkout</h1>
        <p>Your cart is empty. Add products before checkout.</p>
        <Link to="/">Browse products</Link>
      </section>
    );
  }

  return (
    <section className="checkout-layout">
      <form className="panel form-grid" onSubmit={handleSubmit}>
        <p className="eyebrow">Dummy payment</p>
        <h1>Checkout</h1>
        <input
          required
          placeholder="Full name"
          value={customer.fullName}
          onChange={(event) => setCustomer({ ...customer, fullName: event.target.value })}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={customer.email}
          onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
        />
        <textarea
          required
          placeholder="Shipping address"
          value={customer.address}
          onChange={(event) => setCustomer({ ...customer, address: event.target.value })}
        />
        <button type="submit">Place dummy order</button>
      </form>

      <aside className="panel">
        <h2>Order summary</h2>
        {cart.items().map((item) => (
          <div className="summary-line" key={item.productId}>
            <span>
              {item.productName} x {item.quantity}
            </span>
            <strong>{item.subtotal().format()}</strong>
          </div>
        ))}
        <div className="summary-line total">
          <span>Total</span>
          <strong>{cart.total().format()}</strong>
        </div>
      </aside>
    </section>
  );
}
