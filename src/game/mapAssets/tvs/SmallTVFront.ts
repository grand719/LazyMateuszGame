import Actor from "../../../engine/framework/Actor";
import { Vector2d } from "../../../engine/framework/types";
import World from "../../../engine/framework/World";

export default class SmallTVFront extends Actor {
  constructor(owningWorld: World, startingPosition: Vector2d) {
    super({
      src: "/tvs/smallTV1.png",
      owningWorld,
      startingPosition,
      hasCollision: true,
      destructionOffset: { x: 300, y: 300 },
    });
  }
}
