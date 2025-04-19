import { Entity } from "./Entity";

class CollisionManager {
  private static instance: CollisionManager;
  private entities = new Set<Entity>();

  private constructor() {}

  public tick(_deltaTime: number) {
    this.checkCollisions();
  }

  public registerEntity(newEntity: Entity) {
    this.entities.add(newEntity);
  }

  public unRegisterEntity(entity: Entity) {
    if (this.entities.has(entity)) {
      console.log(entity);
      this.entities.delete(entity);
    }
  }

  public clearEntities() {
    this.entities.clear();
  }

  private checkCollisions = () => {
    const entitiesArray = Array.from(this.entities);
    if (entitiesArray.length <= 1) {
      return;
    }

    for (let i = 0; i < entitiesArray.length; i++) {
      for (let j = i + 1; j < entitiesArray.length; j++) {
        const entityA = entitiesArray[i];
        const entityB = entitiesArray[j];

        if (this.isColliding(entityA, entityB)) {
          entityA.delegate.onCollide(entityA, entityB);
          entityB.delegate.onCollide(entityB, entityA);
        }
      }
    }
  };

  private isColliding(entityA: Entity, entityB: Entity): boolean {
    const posA = entityA.getPosition();
    const sizeA = entityA.getSize();
    const posB = entityB.getPosition();
    const sizeB = entityB.getSize();

    return (
      posA.x < posB.x + sizeB.x &&
      posA.x + sizeA.x > posB.x &&
      posA.y < posB.y + sizeB.y &&
      posA.y + sizeA.y > posB.y
    );
  }

  public static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new CollisionManager();

    return this.instance;
  }
}

export default CollisionManager.getInstance();
