import Actor from "../../../engine/framework/Actor";
import { Vector2d } from "../../../engine/framework/types";
import World from "../../../engine/framework/World";

export default class NpcTwo extends Actor {
  constructor(owningWorld: World, startingPosition: Vector2d) {
    super({
      src: "/npcs/npc_one2.png",
      owningWorld,
      startingPosition,
      hasCollision: true,
      hasInteraction: false,
      destructionOffset: { x: 300, y: 300 },
    });
  }
}
