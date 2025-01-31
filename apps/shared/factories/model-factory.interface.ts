export interface ModelFactoryOptions<T> {
  state: Partial<T>;
}

const defaultOptions = {
  state: {},
};

export abstract class ModelFactory<T> {
  constructor(
    protected readonly model: any,
    protected options: ModelFactoryOptions<T> = defaultOptions,
  ) {}

  public abstract makeOne(): T;
  protected abstract definition(): Partial<T>;

  public makeMany(count: number): T[] {
    return Array.from({ length: count }).map(() => this.makeOne());
  }

  public withState(state: Partial<T>): this {
    this.options.state = state;

    return this;
  }
}
