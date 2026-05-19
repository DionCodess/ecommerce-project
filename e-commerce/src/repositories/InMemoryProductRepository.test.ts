import { describe, expect, it } from 'vitest';
import { Money, Product } from '../domain';
import { InMemoryProductRepository } from './InMemoryProductRepository';

describe('InMemoryProductRepository', () => {
  it('saves and retrieves typed product objects', async () => {
    const repository = new InMemoryProductRepository([]);
    const product = new Product(
      'prod-repo',
      'Repository Product',
      'A product for repository behavior.',
      'fitness',
      '/test.jpg',
      new Money(6400),
      8,
    );

    await repository.saveProduct(product);

    const savedProduct = await repository.getProductById(product.id);
    expect(savedProduct?.toSnapshot()).toEqual(product.toSnapshot());
  });
});
