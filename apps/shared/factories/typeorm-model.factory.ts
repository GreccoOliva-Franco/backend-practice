import { ModelFactory } from './model-factory.interface';

export abstract class TypeOrmModelFactory<T> extends ModelFactory<T> {
  constructor(protected readonly model: T) {
    super(model);
  }

  public makeOne(): T {
    const properties = {
      ...this.definition(),
      ...this.options.state,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore no comment
    const instance = new this.model();
    Object.keys(properties).forEach((prop) => {
      instance[prop] = properties[prop];
    });

    return instance;
  }

  protected abstract definition(): Partial<T>;
}
