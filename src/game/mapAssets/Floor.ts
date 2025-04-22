import Actor from "../../engine/framework/Actor";
import { Vector2d } from "../../engine/framework/types";
import World from "../../engine/framework/World";

export default class Floor extends Actor {
  constructor(owningWorld: World, startingPoint: Vector2d) {
    super({
      src: "/decorations/floor.png",
      owningWorld,
      startingPosition: startingPoint,
      destructionOffset: { x: 300, y: 300 },
    });
  }
}
