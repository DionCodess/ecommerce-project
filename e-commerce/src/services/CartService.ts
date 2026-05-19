import type { Cart, Product } from '../domain';

export class CartService {
  public addProduct(cart: Cart, product: Product, quantity: number = 1): Cart {
    return cart.addProduct(product, quantity);
  }

  public updateQuantity(cart: Cart, productId: string, quantity: number): Cart {
    return cart.updateQuantity(productId, quantity);
  }

  public removeProduct(cart: Cart, productId: string): Cart {
    return cart.removeProduct(productId);
  }

  public clear(cart: Cart): Cart {
    return cart.clear();
  }
}
