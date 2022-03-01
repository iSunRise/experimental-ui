type ValidationError = {
  message: string;
}

type ValidationCallback<Entity> = (instance: Entity, key: keyof Entity) => ValidationError | undefined;
type AsyncValidationCallback<Entity> = (instance: Entity, key: keyof Entity) => Promise<ValidationError | undefined>;

class Validator<EntityType> {
  private validations: Partial<Record<keyof EntityType, ValidationCallback<EntityType>[]>> = {};
  private asyncValidations: Partial<Record<keyof EntityType, AsyncValidationCallback<EntityType>[]>> = {};
  private entity: EntityType;
  private sealed = false;

  constructor(entity: EntityType) {
    this.entity = entity;
  }

  add(prop: keyof EntityType, callback: ValidationCallback<EntityType>){
    if (this.sealed) throw new Error('new validations can be added in constructor only');

    this.validations[prop] ||= [];
    this.validations[prop]?.push(callback);
  }

  addAsync(prop: keyof EntityType, callback: AsyncValidationCallback<EntityType>){
    if (this.sealed) throw new Error('new validations can be added in constructor only');

    this.asyncValidations[prop] ||= [];
    this.asyncValidations[prop]?.push(callback);
  }

  validate() {
    const errors: (ValidationError | undefined)[] = [];

    Object.keys(this.validations).forEach((k) => {
      const prop = k as keyof EntityType;
      this.validations[prop]?.forEach((callback) => {
        errors.push(callback(this.entity, prop));
      });
    });
    return errors.filter((x) => x !== undefined) as ValidationError[];
  }

  async validateAsync() {
    const syncErrors = this.validate();
    if (syncErrors.length > 0) return syncErrors;

    const promises: Promise<ValidationError | undefined>[] = [];
    Object.keys(this.asyncValidations).forEach((k) => {
      const prop = k as keyof EntityType;
      this.asyncValidations[prop]?.forEach((callback) => {
        promises.push(callback(this.entity, prop));
      });
    });
    const asyncErrors = await Promise.all(promises);
    return asyncErrors.filter((x) => x !== undefined) as ValidationError[];
  }

  seal() {
    this.sealed = true;
  }
}


export default Validator;
