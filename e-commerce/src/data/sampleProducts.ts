import { Money, Product } from '../domain';

export class SampleProductCatalog {
  public createProducts(): readonly Product[] {
    return [
      new Product(
        'prod-smartwatch',
        'PulsePro Smartwatch',
        'Track workouts, sleep, and notifications with a lightweight water-resistant watch.',
        'electronics',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
        new Money(12999),
        18,
        true,
        true,
      ),
      new Product(
        'prod-headphones',
        'AeroSound Headphones',
        'Wireless over-ear headphones with active noise cancellation and 40-hour battery life.',
        'electronics',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
        new Money(8999),
        24,
        true,
        true,
      ),
      new Product(
        'prod-jacket',
        'Everyday Utility Jacket',
        'A durable lightweight jacket with water resistance and clean city styling.',
        'apparel',
        'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80',
        new Money(7499),
        12,
      ),
      new Product(
        'prod-lamp',
        'Minimal Desk Lamp',
        'Adjustable LED desk lamp with warm and cool lighting modes for focused work.',
        'home',
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
        new Money(4599),
        30,
      ),
      new Product(
        'prod-notebook',
        'Design Sprint Notebook',
        'Hardcover dotted notebook for planning user stories, sketches, and sprint notes.',
        'books',
        'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80',
        new Money(1899),
        50,
      ),
      new Product(
        'prod-yoga-mat',
        'GripFlow Yoga Mat',
        'Non-slip exercise mat with extra cushioning for yoga, stretching, and home workouts.',
        'fitness',
        'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=80',
        new Money(3499),
        16,
      ),
    ];
  }
}
