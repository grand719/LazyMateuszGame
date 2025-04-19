import type Actor from "./Actor";
import type Application from "./Application";
import { WorldMap } from "./WorldMap";

type LayeredActorsT = Actor[][];

class World {
  private actors: LayeredActorsT = [];
  private pendingActors: LayeredActorsT = [];
  private owingApplication: Application;
  private worldMap?: WorldMap;

  constructor(owningApplication: Application) {
    this.owingApplication = owningApplication;
  }

  tick(deltaTime: number) {
    this.pendingActors.forEach((layer, index) => {
      layer.forEach((actor) => {
        this.actors[index].push(actor);
      });
      this.pendingActors[index] = [];
    });

    this.actors.forEach((layer) => {
      layer.forEach((actor) => {
        if (!actor.isPendingToDestroy) {
          actor.tick(deltaTime);
        }
      });
    });

    this.cleanActors();
  }

  render(canvas2D: CanvasRenderingContext2D) {
    this.actors.forEach((layer) => {
      layer.forEach((actor) => {
        if (!actor.isPendingToDestroy) {
          actor.render(canvas2D);
        }
      });
    });
  }

  setWorldMap(map: WorldMap) {
    this.worldMap = map;
    this.worldMap.create();
  }

  cleanActors() {
    this.actors.forEach((layer, index) => {
      this.actors[index] = layer.filter((actor) => {
        if (actor.isPendingToDestroy) {
          actor.unregisterEntity();
        }

        return !actor.isPendingToDestroy;
      });
    });
  }

  getWindowSize() {
    return this.owingApplication.getCanvasSize();
  }

  SpawnActor<T extends Actor>(
    layer: number,
    createActor: new (...Args: any[]) => T,
    ...args: ConstructorParameters<typeof createActor>
  ) {
    const actor = new createActor(...args);
    if (!this.pendingActors[layer]) {
      this.pendingActors[layer] = [];
    }

    if (!this.actors[layer]) {
      this.actors[layer] = [];
    }

    this.pendingActors[layer].push(actor);
    return actor;
  }
}

export default World;
