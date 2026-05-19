import { useCallback, useEffect, useState } from 'react';
import { ProductForm } from '../components/admin/ProductForm';
import { Money, type Order, type OrderStatus, type Product } from '../domain';
import type { AdminSession, DashboardMetrics } from '../services';
import type { ServicesPageProps } from './PageProps';

const statuses: readonly OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'cancelled'];

export function AdminDashboardPage({ services }: ServicesPageProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [products, setProducts] = useState<readonly Product[]>([]);
  const [orders, setOrders] = useState<readonly Order[]>([]);
  const [session, setSession] = useState<AdminSession | null>(() =>
    services.adminAuthService.currentSession(),
  );
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const refreshDashboard = useCallback(async (): Promise<void> => {
    const [nextMetrics, nextProducts, nextOrders] = await Promise.all([
      services.adminService.getDashboardMetrics(),
      services.adminService.getProducts(),
      services.adminService.getOrders(),
    ]);

    setMetrics(nextMetrics);
    setProducts(nextProducts);
    setOrders(nextOrders);
  }, [services]);

  useEffect(() => {
    if (session) {
      void refreshDashboard();
    }
  }, [refreshDashboard, session]);

  if (!session) {
    return (
      <section className="panel form-grid">
        <p className="eyebrow">Admin sign in</p>
        <h1>Sign in to manage the store</h1>
        <input
          required
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            void services.adminAuthService.signIn(email, password).then(setSession);
          }}
        >
          Sign in
        </button>
      </section>
    );
  }

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Catalog and order operations</h1>
          <p>
            Signed in as {session.email}
            {session.firebaseBacked ? ' through Firebase Auth' : ' in local demo mode'}.
          </p>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            void services.adminAuthService.signOut().then(() => setSession(null));
          }}
        >
          Sign out
        </button>
      </div>

      <div className="metrics-grid">
        <MetricCard label="Products" value={metrics?.productCount.toString() ?? '0'} />
        <MetricCard label="Active products" value={metrics?.activeProductCount.toString() ?? '0'} />
        <MetricCard label="Orders" value={metrics?.orderCount.toString() ?? '0'} />
        <MetricCard
          label="Revenue"
          value={new Money(metrics?.revenueInCents ?? 0).format()}
        />
      </div>

      <ProductForm
        onSubmit={async (input) => {
          await services.productService.saveFromInput(input);
          await refreshDashboard();
        }}
      />

      <section className="panel">
        <h2>Products</h2>
        <div className="admin-list">
          {products.map((product) => (
            <article className="admin-row" key={product.id}>
              <div>
                <strong>{product.name}</strong>
                <p>
                  {product.price.format()} · {product.inventoryCount} units ·{' '}
                  {product.isActive ? 'active' : 'inactive'}
                </p>
              </div>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  void services.productService.deleteProduct(product.id).then(refreshDashboard);
                }}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Orders</h2>
        <div className="admin-list">
          {orders.length === 0 ? <p>No orders yet. Complete a dummy checkout first.</p> : null}
          {orders.map((order) => (
            <article className="admin-row" key={order.id}>
              <div>
                <strong>{order.customer.fullName}</strong>
                <p>
                  {order.id} · {order.total.format()} · {order.createdAt.toLocaleDateString()}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(event) => {
                  void services.adminService
                    .updateOrderStatus(order.id, event.target.value as OrderStatus)
                    .then(refreshDashboard);
                }}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

interface MetricCardProps {
  readonly label: string;
  readonly value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
