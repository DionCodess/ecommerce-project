import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Cart } from './domain';
import { Layout } from './components/layout/Layout';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { StorefrontPage } from './pages/StorefrontPage';
import { applicationServices } from './services';

export function App() {
  const [cart, setCart] = useState<Cart>(Cart.empty());

  return (
    <Layout cartItemCount={cart.itemCount()}>
      <Routes>
        <Route
          path="/"
          element={<StorefrontPage cart={cart} setCart={setCart} services={applicationServices} />}
        />
        <Route
          path="/products/:productId"
          element={<ProductDetailsPage cart={cart} setCart={setCart} services={applicationServices} />}
        />
        <Route
          path="/cart"
          element={<CartPage cart={cart} setCart={setCart} services={applicationServices} />}
        />
        <Route
          path="/checkout"
          element={<CheckoutPage cart={cart} setCart={setCart} services={applicationServices} />}
        />
        <Route path="/admin" element={<AdminDashboardPage services={applicationServices} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
