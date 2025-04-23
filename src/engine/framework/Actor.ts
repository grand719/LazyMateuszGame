import CollisionManager from "../../CollisionManager/CollisionManager";
import { Entity } from "../../CollisionManager/Entity";
import { InteractionEntity } from "../../InteractionManager.ts/InteractionEntity";
import InteractionManager from "../../InteractionManager.ts/InteractionManager";
import AssetManager from "./AssetManager";
import Log from "./Log";
import Object from "./Object";
import { Vector2d } from "./types";
import type World from "./World";

type ActorConstructor = {
  src: string;
  owningWorld: World;
  startingPosition: Vector2d;
  hasCollision?: boolean;
  hasInteraction?: boolean;
  interactionOffset?: Vector2d;
  hasPlayerInteraction?: boolean;
  speed?: number;
  velocity?: Vector2d;
  destructionOffset?: Vector2d;
  offset?: Vector2d;
  collisionOffset?: Vector2d;
};

const defaultActorConstructorParams = {
  hasCollision: false,
  hasInteraction: false,
  hasPlayerInteraction: false,
  interactionOffset: { x: 0, y: 0 },
  speed: 0,
  velocity: { x: 0, y: 0 },
  destructionOffset: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  collisionOffset: { x: 0, y: 0 },
};

const TAG = "Actor";
class Actor extends Object {
  private texture?: HTMLImageElement;
  private position: Vector2d;
  private velocity: Vector2d;
  private destructionOffset: Vector2d;
  private offset: Vector2d;
  private speed = 0;
  private rotation = 0;
  private entity?: Entity;
  private hasCollision = false;
  private collisionOffset: Vector2d;

  private hasInteraction = false;
  private hasPlayerInteraction = false;
  private interactionOffset = { x: 0, y: 0 };
  private interactionEntity?: InteractionEntity;

  public worldRef: World;

  constructor(paramsProps: ActorConstructor) {
    super();
    const params = { ...defaultActorConstructorParams, ...paramsProps };

    const {
      src,
      speed,
      startingPosition,
      owningWorld,
      hasCollision,
      hasInteraction,
      hasPlayerInteraction,
      interactionOffset,
      velocity,
      destructionOffset,
      offset,
      collisionOffset,
    } = params;

    if (src) {
      AssetManager.getImage(src)
        .then((texture) => {
          this.texture = texture;
        })
        .finally(() => {
          if (hasCollision) {
            this.registerEntity(startingPosition, {
              x: this.texture ? this.texture.width : 0,
              y: this.texture ? this.texture.height : 0,
            });
          }

          if (hasInteraction || hasPlayerInteraction) {
            this.registerInteractionEntity(startingPosition, {
              x: this.texture ? this.texture.width : 0,
              y: this.texture ? this.texture.height : 0,
            });
          }
        });
    }

    this.worldRef = owningWorld;
    this.velocity = velocity;
    this.position = startingPosition;
    this.speed = speed;
    this.offset = offset;
    this.destructionOffset = destructionOffset;
    this.hasCollision = hasCollision;
    this.collisionOffset = collisionOffset;
    this.hasInteraction = hasInteraction;
    this.hasPlayerInteraction = hasPlayerInteraction;
    this.interactionOffset = interactionOffset;
  }

  setTexture(image?: HTMLImageElement) {
    if (image) {
      this.texture = image;

      if (
        (this.hasInteraction || this.hasPlayerInteraction) &&
        !this.interactionEntity
      ) {
        this.registerInteractionEntity(this.position, {
          x: this.texture ? this.texture.width : 0,
          y: this.texture ? this.texture.height : 0,
        });
      } else if (
        (this.hasInteraction || this.hasPlayerInteraction) &&
        this.interactionEntity
      ) {
        this.interactionEntity.setSize({
          x: this.texture ? this.texture.width : 0,
          y: this.texture ? this.texture.height : 0,
        });
      }

      if (this.hasCollision && !this.entity) {
        this.registerEntity(this.position, {
          x: this.texture ? this.texture.width : 0,
          y: this.texture ? this.texture.height : 0,
        });
      } else if (this.hasCollision && this.entity) {
        this.entity?.setSize({
          x: this.texture ? this.texture.width : 0,
          y: this.texture ? this.texture.height : 0,
        });
      }
    }
  }

  getTextureSize(): Vector2d {
    return {
      x: this.texture ? this.texture.width : 0,
      y: this.texture ? this.texture.height : 0,
    };
  }

  render(canvas2D: CanvasRenderingContext2D) {
    const { x, y } = this.position;

    if (this.texture) {
      canvas2D.save();
      canvas2D.rotate(this.rotation);
      canvas2D.drawImage(this.texture, x, y);
      canvas2D.restore();
    }
  }

  tick(deltaTime: number) {
    this.updatePosition(deltaTime);
    if (this.hasCollision && this.entity) {
      this.entity.setPosition(this.position);
    }

    if (
      (this.hasInteraction || this.hasPlayerInteraction) &&
      this.interactionEntity
    ) {
      this.interactionEntity.setPosition(this.position);
    }
    this.isOutOfBounds();
  }

  setVelocity(velocity: Vector2d) {
    const { x, y } = velocity;
    const magnitude = Math.sqrt(x ** 2 + y ** 2);

    if (magnitude === 0) {
      this.velocity = velocity;
      return;
    }

    this.velocity = this.velocityWithRotation({
      x: (x / magnitude) * this.speed,
      y: (y / magnitude) * this.speed,
    });

    return this.velocity;
  }

  setRotation(degrees: number) {
    this.rotation = (degrees * Math.PI) / 180;
    this.setVelocity(this.velocityWithRotation(this.velocity));
  }

  velocityWithRotation(velocity: Vector2d) {
    return {
      x:
        velocity.x * Math.cos(this.rotation) -
        velocity.y * Math.sin(this.rotation),
      y:
        velocity.x * Math.sin(this.rotation) +
        velocity.y * Math.cos(this.rotation),
    };
  }

  setPosition(position: Vector2d) {
    this.position = position;
  }

  getPosition() {
    return this.position;
  }

  onCollide = (_entityA: Entity, _entityB: Entity) => {};

  unregisterEntity() {
    if (this.entity) {
      CollisionManager.unRegisterEntity(this.entity);
    }

    if (this.interactionEntity) {
      if (this.hasInteraction) {
        InteractionManager.removeInteractionEntity(this.interactionEntity);
      }

      if (this.hasPlayerInteraction) {
        InteractionManager.setPlayerEntity(undefined);
      }
    }
  }

  private registerEntity(position: Vector2d, size: Vector2d) {
    const newPosition = {
      x: position.x - this.collisionOffset.x,
      y: position.y - this.collisionOffset.y,
    };

    const newSize = {
      x: size.x - this.collisionOffset.x,
      y: size.y - this.collisionOffset.y,
    };

    this.entity = new Entity(newPosition, newSize, this);
    CollisionManager.registerEntity(this.entity);
  }

  private registerInteractionEntity(position: Vector2d, size: Vector2d) {
    const newPosition = {
      x: position.x - this.collisionOffset.x,
      y: position.y - this.collisionOffset.y,
    };

    const newSize = {
      x: size.x - this.collisionOffset.x,
      y: size.y - this.collisionOffset.y,
    };

    this.interactionEntity = new InteractionEntity(newPosition, newSize, this);

    if (this.hasPlayerInteraction) {
      InteractionManager.setPlayerEntity(this.interactionEntity);
    }

    if (this.hasInteraction) {
      InteractionManager.addInteractionsEntities(this.interactionEntity);
    }
  }

  private updatePosition(deltaTime: number) {
    const { x, y } = this.velocity;

    this.position.x += x * deltaTime;
    this.position.y += y * deltaTime;
  }

  private isOutOfBounds() {
    const { x: positionX, y: positionY } = this.position;
    const { height, width } = this.worldRef.getWindowSize();

    if (
      positionX >= width + this.destructionOffset.x ||
      positionY >= height + this.destructionOffset.y
    ) {
      this.setPendingToDestroy();
    } else if (
      positionX <= -this.destructionOffset.x ||
      positionY <= -this.destructionOffset.y
    ) {
      this.setPendingToDestroy();
    }
  }

  public onInteract() {
    Log.info(TAG, "onInteract");
  }
}

export default Actor;
