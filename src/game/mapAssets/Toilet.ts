import Actor from "../../engine/framework/Actor";
import { Vector2d } from "../../engine/framework/types";
import World from "../../engine/framework/World";
import TypoMaster from "../typoMaster/TypoMaster";
import ScoreManager from "../scoreManager/ScoreManager";

export default class Toilet extends Actor {
  private wordList: string[] = [
    "tiktok", "reddit", "flush", "stall", "pause",
    "scroll", "mirror", "instagram", "boredom", "escape",
    "hideout", "doomscroll", "memes", "snapchat", "yawn"
  ];

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
    TypoMaster.startGame(this.wordList, () => {
      ScoreManager.increaseSlackingOffScore(15);
      ScoreManager.decreaseWorkingScore(5);
    });
  }
  
}
