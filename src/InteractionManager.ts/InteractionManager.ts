import AssetManager from "../engine/framework/AssetManager";
import TypoMaster from "../game/typoMaster/TypoMaster";
import { InteractionEntity } from "./InteractionEntity";

class InteractionManager {
  private static instance: InteractionManager;

  private entitiesToInteract = new Set<InteractionEntity>();
  private playerEntity?: InteractionEntity;
  private currentInteractiveEntity?: InteractionEntity;
  private onInteraction?: ((entity: InteractionEntity) => void)[] = [];

  private pressEAsset?: HTMLImageElement;

  private animationOffset = 0;
  private animationSpeed = 0.05;

  private constructor() {
    AssetManager.getImage("/pressE.png").then((image) => {
      this.pressEAsset = image;
    });
    window.addEventListener("keydown", this.keyHandler);
  }

  private keyHandler = (key: KeyboardEvent) => {
    if (
      key.key === "e" &&
      this.currentInteractiveEntity &&
      !TypoMaster.getShouldBlockMovement()
    ) {
      this.currentInteractiveEntity.delegate.onInteract();
      if (this.currentInteractiveEntity) {
        this.onInteraction?.forEach((callback) => {
          callback(this.currentInteractiveEntity!);
        });
      }
    }
  };

  private updateCurrentInteractiveEntity = () => {
    if (!this.playerEntity) {
      this.currentInteractiveEntity = undefined;
      return;
    }

    const playerPosition = this.playerEntity.getPosition();
    const playerSize = this.playerEntity.getSize();
    const playerInteractionOffset = this.playerEntity.getInteractionOffset();

    let closestEntity: InteractionEntity | undefined = undefined;
    let closestDistance = Infinity;

    this.entitiesToInteract.forEach((entity) => {
      const entityPosition = entity.getPosition();
      const entitySize = entity.getSize();

      const playerCenter = {
        x: playerPosition.x + playerSize.x / 2,
        y: playerPosition.y + playerSize.y / 2,
      };
      const entityCenter = {
        x: entityPosition.x + entitySize.x / 2,
        y: entityPosition.y + entitySize.y / 2,
      };

      const distance = Math.sqrt(
        Math.pow(playerCenter.x - entityCenter.x, 2) +
          Math.pow(playerCenter.y - entityCenter.y, 2)
      );

      const interactionRange =
        Math.max(playerSize.x, playerSize.y) +
        Math.max(playerInteractionOffset.x, playerInteractionOffset.y);

      if (distance <= interactionRange && distance < closestDistance) {
        closestEntity = entity;
        closestDistance = distance;
      }
    });

    if (closestEntity) {
      this.currentInteractiveEntity = closestEntity;
    } else {
      this.currentInteractiveEntity = undefined;
    }
  };

  public addInteractionHandler(
    callbackEntity: (entity: InteractionEntity) => void
  ) {
    this.onInteraction?.push(callbackEntity);
  }

  public addInteractionsEntities(entity: InteractionEntity) {
    if (this.entitiesToInteract.has(entity)) {
      return;
    }

    this.entitiesToInteract.add(entity);
  }

  public setPlayerEntity(entity: InteractionEntity | undefined) {
    this.playerEntity = entity;
  }

  public removeInteractionEntity(entity: InteractionEntity) {
    if (this.entitiesToInteract.has(entity)) {
      this.entitiesToInteract.delete(entity);
    }
  }

  private tickThrottler = 0;

  public tick(_deltaTime: number) {
    if (this.tickThrottler === 15) {
      this.tickThrottler = 0;
      this.updateCurrentInteractiveEntity();
      return;
    }

    this.tickThrottler++;
  }

  public render(canvas2D: CanvasRenderingContext2D) {
    if (!this.pressEAsset || !this.playerEntity) return;
    this.animationOffset =
      (this.animationOffset + this.animationSpeed) % (2 * Math.PI);

    this.entitiesToInteract.forEach((entity) => {
      const entityPosition = entity.getPosition();
      const entitySize = entity.getSize();

      const centerX = entityPosition.x + entitySize.x / 2;
      const centerY = entityPosition.y;

      const bounceOffset = Math.sin(this.animationOffset) * 5;

      const imageWidth = this.pressEAsset!.width;
      const imageHeight = this.pressEAsset!.height;
      const imageX = centerX - imageWidth / 2;
      const imageY = centerY - imageHeight + bounceOffset;

      if (entity === this.currentInteractiveEntity) {
        canvas2D.globalAlpha = 1.0;
      } else {
        canvas2D.globalAlpha = 0.3;
      }

      canvas2D.drawImage(
        this.pressEAsset!,
        imageX,
        imageY,
        imageWidth,
        imageHeight
      );
    });

    canvas2D.globalAlpha = 1.0;
  }

  public static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new InteractionManager();

    return this.instance;
  }
}

export default InteractionManager.getInstance();
