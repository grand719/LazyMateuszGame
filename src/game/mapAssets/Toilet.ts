import Actor from "../../engine/framework/Actor";
import { Vector2d } from "../../engine/framework/types";
import World from "../../engine/framework/World";
import TypoMaster from "../typoMaster/TypoMaster";

export default class Toilet extends Actor {
  constructor(owningWorld: World, startingPosition: Vector2d) {
    super({
      src: "/toilette/toilet.png",
      owningWorld,
      startingPosition,
      hasCollision: true,
      hasInteraction: true,
      destructionOffset: { x: 300, y: 300 },
    });
  }

  public onInteract(): void {
    TypoMaster.startGame(["mateusz", "marcin", "test"]);
  }
}
