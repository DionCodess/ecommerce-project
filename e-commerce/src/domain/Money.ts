export class Money {
  public constructor(
    public readonly amountInCents: number,
    public readonly currency: string = 'USD',
  ) {
    if (!Number.isInteger(amountInCents) || amountInCents < 0) {
      throw new Error('Money amount must be a non-negative integer number of cents.');
    }
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountInCents + other.amountInCents, this.currency);
  }

  public multiply(quantity: number): Money {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error('Quantity must be a non-negative integer.');
    }

    return new Money(this.amountInCents * quantity, this.currency);
  }

  public format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amountInCents / 100);
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error('Cannot operate on money values with different currencies.');
    }
  }
}
