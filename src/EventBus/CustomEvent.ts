class CustomEvent<T = unknown> {
  payload: T;

  constructor(payload: T) {
    this.payload = payload;
  }
}

export default CustomEvent;
