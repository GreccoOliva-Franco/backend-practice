import { Model } from 'mongoose';

interface Options<T> {
  state: Partial<T>;
  count: number;
}

const defaultOptions = {
  state: {},
  count: 1,
};

export abstract class MongooseModelFactory<T> {
  constructor(
    private readonly model: Model<T>,
    private options: Options<T> = defaultOptions,
  ) {}

  protected abstract definition(): Partial<T>;

  public count(count: number): this {
    this.options = { ...this.options, count };

    return this;
  }

  public withState(state: Partial<T>): this {
    this.options = { ...this.options, state };

    return this;
  }

  public make() {
    return this.options.count === 1 ? this.makeOne() : this.makeMany();
  }

  private makeOne(): T {
    return new this.model({
      ...this.definition(),
      ...this.options.state,
    });
  }

  private makeMany(): T[] {
    return Array.from({ length: this.options.count }).map(() => this.makeOne());
  }
}
