import { CustomEvent } from '../EventBus';

import BaseEntity from './BaseEntity';

class EntityEvent<T = BaseEntity> extends CustomEvent<T> {}
class EntityBuilt<T = BaseEntity> extends EntityEvent<T> {}
class EntityCreated<T = BaseEntity> extends EntityEvent<T> {}
class EntityUpdated<T = BaseEntity> extends EntityEvent<T> {}
class EntityRemoved<T = BaseEntity> extends EntityEvent<T> {}

const Events = {
  EntityBuilt,
  EntityCreated,
  EntityUpdated,
  EntityRemoved
};

export default Events;
