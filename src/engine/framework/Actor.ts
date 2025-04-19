import CollisionManager from "../../CollisionManager/CollisionManager";
import { Entity } from "../../CollisionManager/Entity";
import AssetManager from "./AssetManager";
import Object from "./Object";
import { Vector2d } from "./types";
import type World from "./World";

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

  public worldRef: World;

  constructor(
    src: string,
    owingWorld: World,
    startingPosition: Vector2d,
    hasCollision: boolean = false,
    speed = 0,
    velocity: Vector2d = { x: 0, y: 0 },
    destructionOffset: Vector2d = { x: 0, y: 0 },
    offset: Vector2d = { x: 0, y: 0 }
  ) {
    super();
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
        });
    }
    this.worldRef = owingWorld;
    this.velocity = velocity;
    this.position = startingPosition;
    this.speed = speed;
    this.offset = offset;
    this.destructionOffset = destructionOffset;
    this.hasCollision = hasCollision;
  }

  setTexture(image?: HTMLImageElement) {
    if (image) {
      this.texture = image;

      if (this.hasCollision && !this.entity) {
        this.registerEntity(this.position, {
          x: this.texture ? this.texture.width : 0,
          y: this.texture ? this.texture.height : 0,
        });
        return;
      }

      if (this.hasCollision && this.entity) {
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

  getPosition() {
    return this.position;
  }

  onCollide = (entityA: Entity, entityB: Entity) => {
    console.log("Colided with", entityA, entityB);
  };

  unregisterEntity() {
    if (this.entity) {
      CollisionManager.unRegisterEntity(this.entity);
    }
  }

  private registerEntity(position: Vector2d, size: Vector2d) {
    console.log(this);
    this.entity = new Entity(position, size, this);
    CollisionManager.registerEntity(this.entity);
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
}

export default Actor;
