import Actor from "../../engine/framework/Actor";
import { Vector2d } from "../../engine/framework/types";
import World from "../../engine/framework/World";
import TypoMaster from "../typoMaster/TypoMaster";
import ScoreManager from "../scoreManager/ScoreManager";

export default class Chair extends Actor {
  private wordList: string[] = [
    "slouch", "spin", "nap", "chitchat", "stretch",
    "leanback", "sleep", "idle", "swivel", "zoneout",
    "coffee", "daydream", "fidget", "yawn", "gossip"
  ];

  constructor(owningWorld: World, startingPosition: Vector2d) {
    super({
      src: "/furniture/chair.png",
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
