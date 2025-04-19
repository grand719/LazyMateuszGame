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
    this.handleKeyPres();
  }

  public setPendingToDestroy(): void {
    super.setPendingToDestroy();
    document.removeEventListener("keydown", this.onKeyPress);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    this.pressedKeys.add(event.key);
  };

  private onKeyUp = (event: KeyboardEvent) => {
    this.pressedKeys.delete(event.key);
  };

  private onKeyPress = () => {
    this.moveInput = { x: 0, y: 0 };

    if (this.pressedKeys.has("ArrowUp")) {
      this.setTexture(this.playerImages?.[PlayerImages.PlayerBack]);
      this.moveInput.y = -1;
    }
    if (this.pressedKeys.has("ArrowDown")) {
      this.setTexture(this.playerImages?.[PlayerImages.PlayerFront]);
      this.moveInput.y = 1;
    }
    if (this.pressedKeys.has("ArrowLeft")) {
      this.setTexture(this.playerImages?.[PlayerImages.PlayerLeft]);
      this.moveInput.x = -1;
    }
    if (this.pressedKeys.has("ArrowRight")) {
      this.setTexture(this.playerImages?.[PlayerImages.PlayerRight]);
      this.moveInput.x = 1;
    }
  };

  private snapMovement() {
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
  }

  private handleKeyPres() {
    this.onKeyPress();
    this.snapMovement();
    this.setVelocity({
      x: this.moveInput.x,
      y: this.moveInput.y,
    });
  }
}

export default Player;
