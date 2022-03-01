import CustomEvent from './CustomEvent';

type EventSubscriber<EventType = CustomEvent> = (e: EventType) => void;

// helper type, basically means any class or function that can be constructed with a "new" keyword
type Instantiable<Instance = any> = new(...args: any) => Instance;


class EventBus {

  subscribers = new Map<Instantiable<CustomEvent>, Set<EventSubscriber>>()

  on<T, E extends CustomEvent = CustomEvent<T>>(event: Instantiable<E>, subscriber: EventSubscriber<E>) {
    const newSubscriber = subscriber as EventSubscriber;
    const subs = this.subscribers.get(event) || new Set();
    subs.add(newSubscriber);
    this.subscribers.set(event, subs);

    const unsubscribe = () => subs.delete(newSubscriber);
    return unsubscribe;
  }

  dispatch(event: CustomEvent) {
    this.subscribers.forEach((subs, eventClass) => {
      if (event instanceof eventClass) subs.forEach((s) => s(event));
    });
  }

}

const eventBus = new EventBus();

export default eventBus;
