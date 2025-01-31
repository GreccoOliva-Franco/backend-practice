// import { HydratedDocument, Model } from 'mongoose';
// import { ModelFactory, ModelFactoryOptions } from './model-factory.interface';

// export abstract class MongooseModelFactory<T> extends ModelFactory<T> {
//   constructor(
//     protected readonly model: Model<T>,
//     private options: ModelFactoryOptions<T>,
//   ) {
//     super(model, options);
//   }

//   protected abstract definition(): Partial<T>;

//   public withState(state: Partial<T>): this {
//     this.options = { ...this.options, state };

//     return this;
//   }

//   public makeOne(): HydratedDocument<T> {
//     return new this.model({
//       ...this.definition(),
//       ...this.options.state,
//     });
//   }

//   public makeMany(count: number): HydratedDocument<T>[] {
//     return Array.from({ length: count }).map(() => this.makeOne());
//   }
// }
