import CollisionManager from "../../CollisionManager/CollisionManager";
import Actor from "../../engine/framework/Actor";
import Application from "../../engine/framework/Application";
import World from "../../engine/framework/World";
import {
  MappedStaticObjects,
  WorldMap,
  WorldMapGrid,
} from "../../engine/framework/WorldMap";
import DeskBack from "../mapAssets/DeskBack";
import DeskFront from "../mapAssets/DeskFront";

import FrontSofaLeft from "../mapAssets/sofas/FrontSofaLeft";
import FrontSofaRight from "../mapAssets/sofas/FrontSofaRight";
import BackSofaLeft from "../mapAssets/sofas/BackSofaLeft";
import BackSofaRight from "../mapAssets/sofas/BackSofaRight";

import SmallTVFront from "../mapAssets/tvs/SmallTVFront";
import FrontWideTVLeft from "../mapAssets/tvs/FrontWideTVLeft";
import FrontWideTVRight from "../mapAssets/tvs/FrontWideTVRight";
import BackWideTVLeft from "../mapAssets/tvs/BackWideTVLeft";
import BackWideTVRight from "../mapAssets/tvs/BackWideTVRight";

import Sink from "../mapAssets/Sink";
import Toilet from "../mapAssets/Toilet";

import VerticalWall from "../mapAssets/walls/VerticalWall";
import HorizontalWall from "../mapAssets/walls/HorizontalWall";
import LeftBottomWall from "../mapAssets/walls/LeftBottomWall";
import LeftTopWall from "../mapAssets/walls/LeftTopWall";
import RightBottomWall from "../mapAssets/walls/RightBottomWall";
import RightTopWall from "../mapAssets/walls/RightTopWall";

import Floor from "../mapAssets/Floor";
import Plant from "../mapAssets/Plant";
import Player from "../player/Player";

const floor = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const top = [
  ["_", "_", "_", "_", "_", "_", "_", "_", 5, "_", "_", "_", "_", "_"],
  [4, 4, 4, 4, 2, "_", "_", "_", 5, "_", "_", "_", "_", "_"],
  [3, 3, 3, 3, 2, "_", "_", "_", 5, "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  [4, 4, 4, 4, 2, "_", "_", "_", 5, "_", "_", "_", "_", "_"],
  [3, 3, 3, 3, 2, "_", "_", "_", 7, 6, 6, "_", "_", 6, 6, 6],
  ["_", "_", "_", "_", "_", 1, "_", "_", "_", 14, 15, "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  [4, 4, 4, 4, 2, "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  [3, 3, 3, 3, 2, "_", "_", "_", "_", "_", "_", "_", "_", "_", 18, 19],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", 16, 17],
  [6, 6, 6, 10, "_", "_", "_", "_", "_", 13, "_", "_", "_", 8, 6, 6],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", 13],
  [12, "_", 11, 5, "_", "_", "_", "_", 20, 21, 2, "_", "_", 5],
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
  2: {
    actor: Plant as unknown as typeof Actor,
    layer: 1,
  },
  3: {
    actor: DeskFront as unknown as typeof Actor,
    layer: 1,
  },
  4: {
    actor: DeskBack as unknown as typeof Actor,
    layer: 1,
  },
  5: {
    actor: VerticalWall as unknown as typeof Actor,
    layer: 1,
  },
  6: {
    actor: HorizontalWall as unknown as typeof Actor,
    layer: 1,
  },
  7: {
    actor: LeftBottomWall as unknown as typeof Actor,
    layer: 1,
  },
  8: {
    actor: LeftTopWall as unknown as typeof Actor,
    layer: 1,
  },
  9: {
    actor: RightBottomWall as unknown as typeof Actor,
    layer: 1,
  },
  10: {
    actor: RightTopWall as unknown as typeof Actor,
    layer: 1,
  },
  11: {
    actor: Sink as unknown as typeof Actor,
    layer: 1,
  },
  12: {
    actor: Toilet as unknown as typeof Actor,
    layer: 1,
  },
  13: {
    actor: SmallTVFront as unknown as typeof Actor,
    layer: 1,
  },
  14: {
    actor: FrontWideTVLeft as unknown as typeof Actor,
    layer: 1,
  },
  15: {
    actor: FrontWideTVRight as unknown as typeof Actor,
    layer: 1,
  },
  16: {
    actor: BackWideTVLeft as unknown as typeof Actor,
    layer: 1,
  },
  17: {
    actor: BackWideTVRight as unknown as typeof Actor,
    layer: 1,
  },
  18: {
    actor: FrontSofaLeft as unknown as typeof Actor,
    layer: 1,
  },
  19: {
    actor: FrontSofaRight as unknown as typeof Actor,
    layer: 1,
  },
  20: {
    actor: BackSofaLeft as unknown as typeof Actor,
    layer: 1,
  },
  21: {
    actor: BackSofaRight as unknown as typeof Actor,
    layer: 1,
  },
};

class MainApplication extends Application {
  constructor() {
    super(800, 800, "TestApplication", "root");
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
