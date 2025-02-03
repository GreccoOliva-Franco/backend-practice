export interface ModelFactoryOptions<T> {
  state: Partial<T>;
  pick?: (keyof T)[];
  omit?: (keyof T)[];
  properties?: (keyof T)[];
}

const defaultOptions = {
  state: {},
};

export abstract class ModelFactory<T> {
  constructor(
    protected readonly model: any,
    protected options: ModelFactoryOptions<T> = defaultOptions,
  ) {}

  protected abstract getAllProperties(): T;

  public makeOne(): T {
    const properties = this.getProperties();

    return Object.assign(new this.model(), properties);
  }

  public makeMany(count: number): T[] {
    return Array(count)
      .fill(1)
      .map(() => this.makeOne());
  }

  public withState(state: Partial<T>): this {
    this.options.state = state;

    return this;
  }

  public pick(props: (keyof T)[]): this {
    this.options.pick = props;

    return this;
  }

  public omit(props: (keyof T)[]): this {
    this.options.omit = props;

    return this;
  }

  protected getProperties(): Partial<T> {
    this.setProperties();

    const props = { ...this.getAllProperties(), ...this.options.state } as T;

    return Object.fromEntries(
      Object.entries(props).filter((entry) =>
        this.options.properties.includes(entry[0] as keyof T),
      ),
    ) as Partial<T>;
  }

  protected setProperties(): void {
    if (this.options?.properties) {
      return;
    }

    let keys = Object.keys(this.getAllProperties()) as (keyof T)[];

    if (this.options?.omit) {
      keys = keys.filter((key) => !this.options.omit.includes(key as keyof T));
    }
    if (this.options?.pick) {
      keys = keys.filter((key) => this.options.pick.includes(key as keyof T));
    }

    this.options.properties = keys;
  }
}
