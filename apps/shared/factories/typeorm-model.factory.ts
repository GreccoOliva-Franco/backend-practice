import { ModelFactory } from './model-factory.factory';

export abstract class TypeOrmModelFactory<T> extends ModelFactory<T> {
  constructor(protected readonly model: T) {
    super(model);
  }

  protected abstract getAllProperties(): T;
}
