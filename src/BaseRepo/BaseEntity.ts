
type BaseEntityDTO = {
  id: number;
};


type ValidationError = {
  message: string;
}

type ValidationCallback<DTO, Entity extends BaseEntity<DTO>> = (instance: Entity, key: keyof Entity) => ValidationError | undefined;
type AsyncValidationCallback<DTO, Entity extends BaseEntity<DTO>> = (instance: Entity, key: keyof Entity) => Promise<ValidationError | undefined>;


class Validator<DTO, EntityType extends BaseEntity<DTO>> {
  private validations: Partial<Record<keyof EntityType, ValidationCallback<DTO, EntityType>[]>> = {};
  private asyncValidations: Partial<Record<keyof EntityType, AsyncValidationCallback<DTO, EntityType>[]>> = {};
  private entity: EntityType;
  private sealed = false;

  constructor(entity: EntityType) {
    this.entity = entity;
  }

  add(prop: keyof EntityType, callback: ValidationCallback<DTO, EntityType>){
    if (this.sealed) throw new Error('new validations can be added in constructor only');

    this.validations[prop] ||= [];
    this.validations[prop]?.push(callback);
  }

  addAsync(prop: keyof EntityType, callback: AsyncValidationCallback<DTO, EntityType>){
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

class BaseEntity<DTO> {
  protected dto: DTO

  protected validations: Validator<DTO, typeof this>;

  constructor(dto: DTO) {
    this.dto = dto;

    this.validations = new Validator<DTO, typeof this>(this);
    this.initValidations();
  }

  _validations =
  set validations(values) {

  }

  initValidations() {}
  validate() { return this.validations.validate() }
  validateAsync() { return this.validations.validateAsync() }
}


// ------------------------------ remove

type PostDTO = BaseEntityDTO & {
  name: string;
  body: string;
  published: boolean;
};


class Post extends BaseEntity<PostDTO> {
  get id() { return this.dto.id }
  get name() { return this.dto.name }


  initValidations(){
    this.validations.add('id', (post, key) => ({ message: `${key} cannot be blank`}));
    this.validations.addAsync('name', this.validateName);
  }

  // validations = [
  //   this.addValidator('name', (post, attribute) => ({ message: "nice" }))
  // ]

  validateName = async () => {
    return { message: "name invalid async" }
  }
}

const post = new Post({ id: 2, name: 'a', body: 'b', published: true });
console.log(post.validate())
console.log(post.validateAsync())

// ------------------------------

export default BaseEntity;
