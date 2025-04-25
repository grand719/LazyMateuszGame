import Actor from "../../engine/framework/Actor";
import AssetManager from "../../engine/framework/AssetManager";
import { Vector2d } from "../../engine/framework/types";
import World from "../../engine/framework/World";
import * as pf from "@cetfox24/pathfinding-js";
import { InteractionEntity } from "../../InteractionManager.ts/InteractionEntity";
import InteractionManager from "../../InteractionManager.ts/InteractionManager";

enum BossImages {
  BossBack = "/boss/Boss2.png",
  BossFront = "/boss/Boss1.png",
  BossRight = "/boss/Boss3.png",
  BossLeft = "/boss/Boss4.png",
}

export default class Boss extends Actor {
  private map: any[][];
  private blankSpaceSign: any;
  private getPlayerPosition: () => Vector2d;
  private grid: pf.Grid;
  private finder: pf.AStar;
  private startingPosition: Vector2d;
  private path: Vector2d[] | undefined;
  private bossImages?: Record<string, HTMLImageElement>;

  constructor(
    owningWorld: World,
    startingPosition: Vector2d,
    map: any[][],
    blankSpaceSign: any
    // getPlayerPosition: () => Vector2d,
  ) {
    super({
      src: "",
      owningWorld,
      startingPosition,
      speed: 50,
      destructionOffset: { x: 300, y: 300 },
    });

    AssetManager.getMultipleImages(Object.values(BossImages)).then((images) => {
      this.bossImages = images;
      this.setTexture(this.bossImages[BossImages.BossFront]);
    });

    this.startingPosition = startingPosition;

    this.getPlayerPosition = () => ({ x: 250, y: 350 });
    this.map = map;
    this.blankSpaceSign = blankSpaceSign;

    this.grid = new pf.Grid(this.map.length, map[0].length);
    this.map.forEach((cell, indexRow) => {
      cell.forEach((value, indexColl) => {
        if (
          value !== this.blankSpaceSign ||
          (value !== 1 && value !== this.blankSpaceSign)
        ) {
          this.grid.setSolid(indexColl, indexRow, true);
        }
      });
    });

    this.finder = new pf.AStar();
    InteractionManager.addInteractionHandler(this.onInteraction);
  }

  tick(deltaTime: number): void {
    super.tick(deltaTime);
    this.followPath();
    this.setImagesBasedOnVelocity();
  }

  private findPath = (destination: Vector2d) => {
    const currentPosition = this.getPosition();
    let result = this.finder.findPath(
      { x: currentPosition.x / 50, y: currentPosition.y / 50 },
      { x: destination.x / 50, y: destination.y / 50 },
      this.grid
    );

    this.path = result.path;
  };

  private currentTargetDestinationIndex = 0;

  private followPath = () => {
    if (!this.path || this.path.length === 0) return;

    if (this.path.length - 1 === this.currentTargetDestinationIndex) {
      this.setVelocity({ x: 0, y: 0 });
      this.setPosition({
        x: this.path[this.path.length - 2].x * 50,
        y: this.path[this.path.length - 2].y * 50,
      });

      this.path = undefined;
      this.currentTargetDestinationIndex = 0;
      return;
    }

    const targetDestination = this.path![this.currentTargetDestinationIndex];
    const targetPositionCoords = {
      x: targetDestination.x * 50,
      y: targetDestination.y * 50,
    };

    const currentPosition = this.getPosition();

    if (
      currentPosition.x === targetPositionCoords.x &&
      currentPosition.y === targetPositionCoords.y
    ) {
      this.setPosition({
        x: targetPositionCoords.x,
        y: targetPositionCoords.y,
      });
      this.currentTargetDestinationIndex++;
      return;
    }

    if (currentPosition.x > targetPositionCoords.x) {
      this.setVelocity({ x: -1, y: 0 });
    }

    if (currentPosition.x < targetPositionCoords.x) {
      this.setVelocity({ x: 1, y: 0 });
    }

    if (currentPosition.y > targetPositionCoords.y) {
      this.setVelocity({ x: 0, y: -1 });
    }

    if (currentPosition.y < targetPositionCoords.y) {
      this.setVelocity({ x: 0, y: 1 });
    }
  };

  private setImagesBasedOnVelocity() {
    if (!this.bossImages) return;
    const velocity = this.getVelocity();
    if (velocity.x > 0) {
      this.setTexture(this.bossImages[BossImages.BossRight]);
    }

    if (velocity.x < 0) {
      this.setTexture(this.bossImages[BossImages.BossLeft]);
    }

    if (velocity.y > 0) {
      this.setTexture(this.bossImages[BossImages.BossFront]);
    }

    if (velocity.y < 0) {
      this.setTexture(this.bossImages[BossImages.BossBack]);
    }
  }

  private onInteraction = (entity: InteractionEntity) => {
    if (this.path) {
      this.setVelocity({ x: 0, y: 0 });
      this.setPosition({
        x: this.path[this.currentTargetDestinationIndex].x * 50,
        y: this.path[this.currentTargetDestinationIndex].y * 50,
      });

      this.currentTargetDestinationIndex = 0;
      this.path = undefined;
    }

    this.findPath(entity.getPosition());
  };

  protected updatePosition(deltaTime: number) {
    const { x, y } = this.velocity;

    this.position.x += Math.round(x * deltaTime);
    this.position.y += Math.round(y * deltaTime);
  }
}
