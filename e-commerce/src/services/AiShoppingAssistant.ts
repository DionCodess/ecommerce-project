import type { Product } from '../domain';

export class AiShoppingAssistant {
  public createRecommendation(products: readonly Product[], query: string): string {
    const activeProducts = products.filter((product) => product.isInStock());

    if (activeProducts.length === 0) {
      return 'No in-stock products are available right now.';
    }

    const matchingProduct = activeProducts.find((product) => product.matchesSearch(query));
    const recommendedProduct =
      matchingProduct ?? activeProducts.find((product) => product.featured) ?? this.firstProduct(activeProducts);

    return `${recommendedProduct.name} is a strong pick because it fits the current catalog filters, costs ${recommendedProduct.price.format()}, and has ${recommendedProduct.inventoryCount.toString()} units available.`;
  }

  private firstProduct(products: readonly Product[]): Product {
    const product = products[0];

    if (!product) {
      throw new Error('Expected at least one product.');
    }

    return product;
  }
}
