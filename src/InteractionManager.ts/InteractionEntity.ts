import { Vector2d } from "../engine/framework/types";

interface DelegateComponent {
  onInteract: () => void;
}

export class InteractionEntity {
  private position: Vector2d;
  private size: Vector2d;
  private interactionOffset: Vector2d;

  public delegate: DelegateComponent;
  constructor(
    position: Vector2d,
    size: Vector2d,
    delegate: DelegateComponent,
    interactionOffset: Vector2d = { x: 10, y: 10 }
  ) {
    this.position = position;
    this.size = size;
    this.interactionOffset = interactionOffset;
    this.delegate = delegate;
  }

  getInteractionOffset() {
    return this.interactionOffset;
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
