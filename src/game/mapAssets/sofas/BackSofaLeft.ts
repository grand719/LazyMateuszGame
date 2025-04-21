import Actor from "../../../engine/framework/Actor";
import { Vector2d } from "../../../engine/framework/types";
import World from "../../../engine/framework/World";

export default class BackSofaLeft extends Actor {
  constructor(owningWorld: World, startingPosition: Vector2d) {
    super(
      "/furniture/back_sofa_left.png",
      owningWorld,
      startingPosition,
      true,
      0,
      { x: 0, y: 0 },
      { x: 300, y: 300 },
      { x: 0, y: 0 }
    );
  }
}
