import type { Dispatch, SetStateAction } from 'react';
import type { Cart } from '../domain';
import type { ApplicationServices } from '../services';

export interface CartPageProps {
  readonly cart: Cart;
  readonly setCart: Dispatch<SetStateAction<Cart>>;
  readonly services: ApplicationServices;
}

export interface ServicesPageProps {
  readonly services: ApplicationServices;
}
