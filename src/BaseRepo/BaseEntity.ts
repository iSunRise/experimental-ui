import Validator from './Validator';

type BaseEntityDTO = {
  id: number;
};

class BaseEntity<DTO> {
  protected dto: DTO

  protected validations: Validator<typeof this>;

  constructor(dto: DTO) {
    this.dto = dto;

    this.validations = new Validator<typeof this>(this);
    this.initValidations();
  }

  initValidations() {}
  validate() { return this.validations.validate() }
  validateAsync() { return this.validations.validateAsync() }
}


// START: EXAMPLE USAGE WITH VALIDATIONS

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

  async validateName() {
    return { message: "name invalid async" };
  }

  // !!! arrow function doesn't work as validator since it's assigned to prop after we specified validations
  validateName2 = async () => {
    return { message: "name invalid async" };
  }
}

const post = new Post({ id: 2, name: 'a', body: 'b', published: true });
console.log(post.validate())
console.log(post.validateAsync())

// END: EXAMPLE USAGE WITH VALIDATIONS

export default BaseEntity;
