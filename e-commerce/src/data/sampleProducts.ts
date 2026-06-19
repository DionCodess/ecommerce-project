import { Money, Product } from '../domain';

export class SampleProductCatalog {
  public createProducts(): readonly Product[] {
    return [
      new Product(
        'prod-solar-charger',
        'Solar Portable Charger',
        'A compact solar-powered charger that helps users reduce reliance on disposable battery packs and grid charging.',
        'electronics',
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
        new Money(3999),
        18,
        true,
        true,
      ),
      new Product(
        'prod-reusable-bottle',
        'Reusable Steel Water Bottle',
        'A durable insulated bottle designed to reduce single-use plastic waste during school, work, and travel.',
        'electronics',
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
        new Money(2499),
        32,
        true,
        true,
      ),
      new Product(
        'prod-recycled-jacket',
        'Recycled Utility Jacket',
        'A lightweight jacket made for everyday use with recycled material sourcing and long-term wear in mind.',
        'apparel',
        'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80',
        new Money(7499),
        12,
      ),
      new Product(
        'prod-led-lamp',
        'Energy-Saving LED Desk Lamp',
        'An adjustable LED desk lamp that uses efficient lighting modes for studying and remote work.',
        'electronics',
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
        new Money(4599),
        30,
      ),
      new Product(
        'prod-recycled-notebook',
        'Recycled Paper Sprint Notebook',
        'A dotted notebook made with recycled paper for planning user stories, sketches, and sprint notes.',
        'home',
        'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80',
        new Money(1899),
        50,
      ),
      new Product(
        'prod-cork-yoga-mat',
        'Cork Yoga Mat',
        'A non-slip cork exercise mat designed as a longer-lasting alternative to lower-quality disposable fitness gear.',
        'home',
        'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=80',
        new Money(3499),
        16,
      ),
    ];
  }
}