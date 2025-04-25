import Actor from "../../engine/framework/Actor";
import { Vector2d } from "../../engine/framework/types";
import World from "../../engine/framework/World";
import TypoMaster from "../typoMaster/TypoMaster";

export default class PlayerDesk extends Actor {
  private wordList: string[] = [
    "bug", "jira", "commit", "sprint", "ticket",
    "regression", "release", "merge", "workflow", "branch",
    "automation", "screenshot", "deploy", "tester", "review"
  ];

  constructor(owningWorld: World, startingPosition: Vector2d) {
    super({
      src: "/desks/player_desk.png",
      owningWorld,
      startingPosition,
      hasCollision: true,
      hasInteraction: true,
      destructionOffset: { x: 300, y: 300 },
    });
  }

  public onInteract(): void {
    TypoMaster.startGame(this.wordList);
  }
}
