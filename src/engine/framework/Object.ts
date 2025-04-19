class Object {
  constructor() {}

  public isPendingToDestroy = false;
  public setPendingToDestroy() {
    this.isPendingToDestroy = true;
  }
}

export default Object;
