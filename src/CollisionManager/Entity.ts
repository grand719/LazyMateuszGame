import { Vector2d } from "../engine/framework/types";

interface DelegateComponent {
  onCollide: (entityA: Entity, entityB: Entity) => void;
}

export class Entity {
  private position: Vector2d;
  private size: Vector2d;

  public delegate: DelegateComponent;
  constructor(position: Vector2d, size: Vector2d, delegate: DelegateComponent) {
    this.position = position;
    this.size = size;
    this.delegate = delegate;
  }

  setSize(size: Vector2d) {
    this.size = size;
  }

  getSize() {
    return this.size;
  }

  setPosition(position: Vector2d) {
    this.position = position;
  }

  getPosition() {
    return this.position;
  }
}
