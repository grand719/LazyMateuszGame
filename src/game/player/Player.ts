import { Entity } from "../../CollisionManager/Entity";
import Actor from "../../engine/framework/Actor";
import AssetManager from "../../engine/framework/AssetManager";
import { Vector2d } from "../../engine/framework/types";
import type World from "../../engine/framework/World";

enum PlayerImages {
  PlayerBack = "/player/player_back.png",
  PlayerFront = "/player/player_front.png",
  PlayerRight = "/player/player_right.png",
  PlayerLeft = "/player/player_left.png",
}

class Player extends Actor {
  private pressedKeys: Set<string> = new Set();
  private moveInput: Vector2d = { x: 0, y: 0 };
  private playerImages?: Record<string, HTMLImageElement>;
  private collidedObjectRects?: {
    size: Vector2d;
    position: Vector2d;
  };

  constructor(owningWorld: World, startingPosition: Vector2d) {
    super(
      "",
      owningWorld,
      startingPosition,
      true,
      100,
      { x: 0, y: 0 },
      { x: 300, y: 300 }
    );
    AssetManager.getMultipleImages(Object.values(PlayerImages)).then(
      (images) => {
        this.playerImages = images;
        this.setTexture(this.playerImages[PlayerImages.PlayerFront]);
      }
    );
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  public tick(deltaTime: number): void {
    super.tick(deltaTime);
    this.checkIfStillColliding();
    this.handleKeyPres();
  }

  public setPendingToDestroy(): void {
    super.setPendingToDestroy();
    document.removeEventListener("keydown", this.onKeyPress);
  }

  onCollide = (_entityA: Entity, entityB: Entity) => {
    this.collidedObjectRects = {
      position: entityB.getPosition(),
      size: entityB.getSize(),
    };
  };

  private onKeyDown = (event: KeyboardEvent) => {
    this.pressedKeys.add(event.key);
  };

  private onKeyUp = (event: KeyboardEvent) => {
    this.pressedKeys.delete(event.key);
  };

  private onKeyPress = () => {
    this.moveInput = { x: 0, y: 0 };

    if (this.pressedKeys.has("ArrowUp") || this.pressedKeys.has("w")) {
      this.setTexture(this.playerImages?.[PlayerImages.PlayerBack]);
      this.moveInput.y = -1;
    }
    if (this.pressedKeys.has("ArrowDown") || this.pressedKeys.has("s")) {
      this.setTexture(this.playerImages?.[PlayerImages.PlayerFront]);
      this.moveInput.y = 1;
    }
    if (this.pressedKeys.has("ArrowLeft") || this.pressedKeys.has("a")) {
      this.setTexture(this.playerImages?.[PlayerImages.PlayerLeft]);
      this.moveInput.x = -1;
    }
    if (this.pressedKeys.has("ArrowRight") || this.pressedKeys.has("d")) {
      this.setTexture(this.playerImages?.[PlayerImages.PlayerRight]);
      this.moveInput.x = 1;
    }
  };

  private snapMovement = () => {
    const { x, y } = this.getPosition();
    const { width, height } = this.worldRef.getWindowSize();
    const playerSize = this.getTextureSize();

    if (x < 0 && this.moveInput.x === -1) {
      this.moveInput.x = 0;
    }

    if (x + playerSize.x > width && this.moveInput.x === 1) {
      this.moveInput.x = 0;
    }

    if (y < 0 && this.moveInput.y === -1) {
      this.moveInput.y = 0;
    }

    if (y + playerSize.y > height && this.moveInput.y === 1) {
      this.moveInput.y = 0;
    }

    if (this.collidedObjectRects) {
      const collidedObjectPosition = this.collidedObjectRects.position;
      const collidedObjectSize = this.collidedObjectRects.size;

      const deltaXLeft = x + playerSize.x - collidedObjectPosition.x;
      const deltaXRight = collidedObjectPosition.x + collidedObjectSize.x - x;
      const deltaYTop = y + playerSize.y - collidedObjectPosition.y;
      const deltaYBottom = collidedObjectPosition.y + collidedObjectSize.y - y;

      const minDelta = Math.min(
        deltaXLeft,
        deltaXRight,
        deltaYTop,
        deltaYBottom
      );

      if (minDelta === deltaXLeft && this.moveInput.x === 1) {
        this.moveInput.x = 0;
        this.setPosition({ x: collidedObjectPosition.x - playerSize.x, y });
      } else if (minDelta === deltaXRight && this.moveInput.x === -1) {
        this.moveInput.x = 0;
        this.setPosition({
          x: collidedObjectPosition.x + collidedObjectSize.x,
          y,
        });
      } else if (minDelta === deltaYTop && this.moveInput.y === 1) {
        this.moveInput.y = 0;
        this.setPosition({ x, y: collidedObjectPosition.y - playerSize.y });
      } else if (minDelta === deltaYBottom && this.moveInput.y === -1) {
        this.moveInput.y = 0;
        this.setPosition({
          x,
          y: collidedObjectPosition.y + collidedObjectSize.y,
        });
      }
    }
  };

  private handleKeyPres() {
    this.onKeyPress();
    this.snapMovement();
    this.setVelocity({
      x: this.moveInput.x,
      y: this.moveInput.y,
    });
  }

  private checkIfStillColliding = () => {
    if (!this.collidedObjectRects) {
      return false;
    }

    const playerPosition = this.getPosition();
    const playerSize = this.getTextureSize();
    const collidedObjectPosition = this.collidedObjectRects.position;
    const collidedObjectSize = this.collidedObjectRects.size;

    const isColliding =
      playerPosition.x < collidedObjectPosition.x + collidedObjectSize.x &&
      playerPosition.x + playerSize.x > collidedObjectPosition.x &&
      playerPosition.y < collidedObjectPosition.y + collidedObjectSize.y &&
      playerPosition.y + playerSize.y > collidedObjectPosition.y;

    if (!isColliding) {
      this.collidedObjectRects = undefined;
      console.log("Collision ended");
    }

    return isColliding;
  };
}

export default Player;
