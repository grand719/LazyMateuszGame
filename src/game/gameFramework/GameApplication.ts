import CollisionManager from "../../CollisionManager/CollisionManager";
import Actor from "../../engine/framework/Actor";
import Application from "../../engine/framework/Application";
import World from "../../engine/framework/World";
import {
  MappedStaticObjects,
  WorldMap,
  WorldMapGrid,
} from "../../engine/framework/WorldMap";

import Floor from "../mapAssets/Floor";
import Player from "../player/Player";

const floor = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const top = [
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", 1, "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
];

const map: WorldMapGrid = [floor, top];

const mapObjects: MappedStaticObjects = {
  0: {
    actor: Floor as unknown as typeof Actor,
    layer: 0,
  },
  1: {
    actor: Player as unknown as typeof Actor,
    layer: 1,
  },
};

class MainApplication extends Application {
  constructor() {
    super(500, 500, "TestApplication", "root");
    const world = new World(this);
    const worldMap = new WorldMap(world, map, mapObjects, {
      x: 50,
      y: 50,
    });

    world.setWorldMap(worldMap);
    this.setCurrentWorld(world);
  }

  tickInternal(deltaTime: number): void {
    CollisionManager.tick(deltaTime);
    super.tickInternal(deltaTime);
  }

  render(canvas2D: CanvasRenderingContext2D): void {
    canvas2D.fillStyle = "#fff";
    canvas2D.fillRect(0, 0, 500, 500);
  }
}

export function GetApplication() {
  return new MainApplication();
}
