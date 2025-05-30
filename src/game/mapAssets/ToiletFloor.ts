import Actor from "../../engine/framework/Actor";
import { Vector2d } from "../../engine/framework/types";
import World from "../../engine/framework/World";

export default class ToiletFloor extends Actor {
  constructor(owningWorld: World, startingPosition: Vector2d) {
    super({
      src: "/toilette/toilet_floor.png",
      owningWorld,
      startingPosition,
      destructionOffset: { x: 300, y: 300 },
    });
  }
}
