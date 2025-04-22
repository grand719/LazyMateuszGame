import Actor from "../../engine/framework/Actor";
import { Vector2d } from "../../engine/framework/types";
import World from "../../engine/framework/World";

export default class KitchenFloor extends Actor {
  constructor(owningWorld: World, startingPoint: Vector2d) {
    super(
      "/kitchen/kitchen_floor.png",
      owningWorld,
      startingPoint,
      false,
      0,
      { x: 0, y: 0 },
      { x: 300, y: 300 }
    );
  }
}
