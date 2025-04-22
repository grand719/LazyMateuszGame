import AssetManager from "../engine/framework/AssetManager";
import { InteractionEntity } from "./InteractionEntity";

class InteractionManager {
  private static instance: InteractionManager;

  private entitiesToInteract = new Set<InteractionEntity>();
  private playerEntity?: InteractionEntity;
  private currentInteractiveEntity?: InteractionEntity;

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
    if (key.key === "e" && this.currentInteractiveEntity) {
      this.currentInteractiveEntity.delegate.onInteract();
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
    if (
      this.currentInteractiveEntity &&
      this.pressEAsset &&
      this.playerEntity
    ) {
      const entityPosition = this.playerEntity.getPosition();
      const entitySize = this.playerEntity.getSize();

      const centerX = entityPosition.x + entitySize.x / 2;
      const centerY = entityPosition.y;

      this.animationOffset =
        (this.animationOffset + this.animationSpeed) % (2 * Math.PI);
      const bounceOffset = Math.sin(this.animationOffset) * 5;

      const imageWidth = this.pressEAsset.width;
      const imageHeight = this.pressEAsset.height;
      const imageX = centerX - imageWidth / 2;
      const imageY = centerY - imageHeight + bounceOffset;

      canvas2D.drawImage(
        this.pressEAsset,
        imageX,
        imageY,
        imageWidth,
        imageHeight
      );
    }
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
