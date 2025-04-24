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
import PlayerDesk from "../mapAssets/PlayerDesk";

import FrontSofaLeft from "../mapAssets/sofas/FrontSofaLeft";
import FrontSofaRight from "../mapAssets/sofas/FrontSofaRight";
import BackSofaLeft from "../mapAssets/sofas/BackSofaLeft";
import BackSofaRight from "../mapAssets/sofas/BackSofaRight";

import SmallTVFront from "../mapAssets/tvs/SmallTVFront";
import SmallTVBack from "../mapAssets/tvs/SmallTVBack";
import FrontWideTVLeft from "../mapAssets/tvs/FrontWideTVLeft";
import FrontWideTVRight from "../mapAssets/tvs/FrontWideTVRight";
import BackWideTVLeft from "../mapAssets/tvs/BackWideTVLeft";
import BackWideTVRight from "../mapAssets/tvs/BackWideTVRight";

import ToiletFloor from "../mapAssets/ToiletFloor";
import Sink from "../mapAssets/Sink";
import Toilet from "../mapAssets/Toilet";

import KitchenFloor from "../mapAssets/KitchenFloor";
import FridgeBottom from "../mapAssets/kitchen/FridgeBottom";
import FridgeTop from "../mapAssets/kitchen/FridgeTop";
import KitchenSink from "../mapAssets/kitchen/KitchenSink";
import KitchenCabinet from "../mapAssets/kitchen/KitchenCabinet";
import Oven from "../mapAssets/kitchen/Oven";

import RightWall from "../mapAssets/walls/RightWall";
import LeftWall from "../mapAssets/walls/LeftWall";
import TopWall from "../mapAssets/walls/TopWall";
import BottomWall from "../mapAssets/walls/BottomWall";
import LeftBottomWall from "../mapAssets/walls/LeftBottomWall";
import LeftTopWall from "../mapAssets/walls/LeftTopWall";
import RightBottomWall from "../mapAssets/walls/RightBottomWall";
import RightTopWall from "../mapAssets/walls/RightTopWall";

import Chair from "../mapAssets/Chair";
import Table from "../mapAssets/Table";
import Floor from "../mapAssets/Floor";
import Plant from "../mapAssets/Plant";
import Player from "../player/Player";
import InteractionManager from "../../InteractionManager.ts/InteractionManager";
import TypoMaster from "../typoMaster/TypoMaster";

const floor = [
  [0, 0, 0, 0, 0, 0, 0, 0, 25, 25, 25, 25, 25, 25, 25, 25],
  [0, 0, 0, 0, 0, 0, 0, 0, 25, 25, 25, 25, 25, 25, 25, 25],
  [0, 0, 0, 0, 0, 0, 0, 0, 25, 25, 25, 25, 25, 25, 25, 25],
  [0, 0, 0, 0, 0, 0, 0, 0, 25, 25, 25, 25, 25, 25, 25, 25],
  [0, 0, 0, 0, 0, 0, 0, 0, 25, 25, 25, 25, 25, 25, 25, 25],
  [0, 0, 0, 0, 0, 0, 0, 0, 25, 25, 25, 25, 25, 25, 25, 25],
  [0, 0, 0, 0, 0, 0, 0, 0, 25, 25, 25, 25, 25, 25, 25, 25],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [22, 22, 22, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [22, 22, 22, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [22, 22, 22, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const top = [
  ["_", "_", "_", "_", "_", "_", 14, 15, 23, 32, 26, 32, 32, 32, 32, 32],
  [4, 4, 4, 4, 2, "_", "_", "_", 23, 32, 27, 31, 31, 32, 34, 34],
  [3, 3, 3, 3, 2, "_", "_", "_", 23, "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", 28, "_", "_", 28],
  [4, 4, 4, 4, 2, "_", "_", "_", 23, 28, "_", "_", 28, "_", "_", 28],
  [3, 3, 30, 3, 2, "_", "_", "_", 7, 24, 24, "_", "_", 24, 24, 24],
  ["_", "_", "_", "_", "_", 1, "_", "_", "_", 14, 15, "_", "_", 13, "_", 13],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  [4, 4, 4, 4, 2, "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", 28],
  [3, 3, 3, 3, 2, "_", "_", "_", "_", "_", "_", "_", "_", "_", 18, 19],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  [
    20,
    21,
    "_",
    33,
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    16,
    17,
  ],
  [6, 6, 6, 10, "_", "_", "_", "_", "_", 13, "_", "_", "_", 8, 6, 6],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", 13],
  [12, "_", 11, 5, "_", "_", "_", 28, 20, 21, 2, "_", "_", 23, 29],
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
    actor: RightWall as unknown as typeof Actor,
    layer: 1,
  },
  6: {
    actor: TopWall as unknown as typeof Actor,
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
  22: {
    actor: ToiletFloor as unknown as typeof Actor,
    layer: 1,
  },
  23: {
    actor: LeftWall as unknown as typeof Actor,
    layer: 1,
  },
  24: {
    actor: BottomWall as unknown as typeof Actor,
    layer: 1,
  },
  25: {
    actor: KitchenFloor as unknown as typeof Actor,
    layer: 1,
  },
  26: {
    actor: FridgeTop as unknown as typeof Actor,
    layer: 1,
  },
  27: {
    actor: FridgeBottom as unknown as typeof Actor,
    layer: 1,
  },
  28: {
    actor: Table as unknown as typeof Actor,
    layer: 1,
  },
  29: {
    actor: Chair as unknown as typeof Actor,
    layer: 1,
  },
  30: {
    actor: PlayerDesk as unknown as typeof Actor,
    layer: 1,
  },
  31: {
    actor: KitchenSink as unknown as typeof Actor,
    layer: 1,
  },
  32: {
    actor: KitchenCabinet as unknown as typeof Actor,
    layer: 1,
  },
  33: {
    actor: SmallTVBack as unknown as typeof Actor,
    layer: 1,
  },
  34: {
    actor: Oven as unknown as typeof Actor,
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
    InteractionManager.tick(deltaTime);
    TypoMaster.tick(deltaTime);
    super.tickInternal(deltaTime);
  }

  renderInternal(canvas2D: CanvasRenderingContext2D): void {
    super.renderInternal(canvas2D);
    InteractionManager.render(canvas2D);
    TypoMaster.render(canvas2D);
  }

  render(canvas2D: CanvasRenderingContext2D): void {
    canvas2D.fillStyle = "#fff";
    canvas2D.fillRect(0, 0, 500, 500);
  }
}

export function GetApplication() {
  return new MainApplication();
}
