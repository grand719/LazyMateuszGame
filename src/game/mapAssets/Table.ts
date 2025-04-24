import Actor from "../../engine/framework/Actor";
import { Vector2d } from "../../engine/framework/types";
import World from "../../engine/framework/World";

export default class Table extends Actor {
  constructor(owningWorld: World, startingPosition: Vector2d) {
    super({
      src: "/furniture/table.png",
      owningWorld,
      startingPosition,
      hasCollision: true,
      hasInteraction: false,
      destructionOffset: { x: 300, y: 300 },
    });
  }
}
