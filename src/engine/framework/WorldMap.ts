import Actor from "./Actor";
import { Vector2d } from "./types";
import World from "./World";

export type WorldMapGrid = any[][][];
export type MappedStaticObjects = Record<
  any,
  { actor: typeof Actor; layer: number; restParams?: any[] }
>;

export class WorldMap {
  private world: World;
  private worldMap: WorldMapGrid;
  private mappedObjects: MappedStaticObjects;
  private cellSize: Vector2d;
  constructor(
    owningWorld: World,
    worldMap: WorldMapGrid,
    mappedStaticObjects: MappedStaticObjects,
    cellSize: Vector2d
  ) {
    this.world = owningWorld;
    this.worldMap = worldMap;
    this.mappedObjects = mappedStaticObjects;
    this.cellSize = cellSize;
  }

  public create() {
    this.worldMap.forEach((layer) => {
      layer.forEach((row, indexRow) => {
        row.forEach((coll, indexColl) => {
          if (!this.mappedObjects[coll]) {
            return;
          }

          const actor = this.mappedObjects[coll].actor;
          const layer = this.mappedObjects[coll].layer;
          const restParams = this.mappedObjects[coll].restParams ?? [];

          this.world.SpawnActor(
            layer,
            actor,
            this.world,
            {
              x: indexColl * this.cellSize.x,
              y: indexRow * this.cellSize.y,
            },
            ...restParams
          );
        });
      });
    });
  }
}
