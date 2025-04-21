import Actor from "../../../engine/framework/Actor";
import { Vector2d } from "../../../engine/framework/types";
import World from "../../../engine/framework/World";

export default class LeftTopWall extends Actor {
  constructor(owningWorld: World, startingPosition: Vector2d) {
    super(
      "/walls/left_top_wall.png",
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
