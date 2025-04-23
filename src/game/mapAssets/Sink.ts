import Actor from "../../engine/framework/Actor";
import { Vector2d } from "../../engine/framework/types";
import World from "../../engine/framework/World";

export default class Sink extends Actor {
  constructor(owningWorld: World, startingPosition: Vector2d) {
    super({
      src: "/toilette/sink.png",
      owningWorld,
      startingPosition,
      hasCollision: true,
      destructionOffset: { x: 300, y: 300 },
    });
  }
}
