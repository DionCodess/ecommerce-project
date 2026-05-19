import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

interface LayoutProps {
  readonly cartItemCount: number;
  readonly children: ReactNode;
}

export function Layout({ cartItemCount, children }: LayoutProps) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          CS491 Market
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/cart">Cart ({cartItemCount})</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
