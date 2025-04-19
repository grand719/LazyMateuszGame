import Log from "./Log";
import World from "./World";

const TAG = "Application";

class Application {
  private canvas: HTMLCanvasElement | null;
  private currentWorld?: World;
  private canvas2D?: CanvasRenderingContext2D | null;
  private lastTime = 0;
  private accumulatedTime = 0;

  private targetDeltaTime = 1 / 60.0;
  constructor(
    canvasWidth: number,
    canvasHeight: number,
    pageTitle: string,
    rootId: string
  ) {
    this.canvas = this.createCanvas(rootId, canvasHeight, canvasWidth);
    document.title = pageTitle;
    if (!this.canvas) {
      alert("Root element is not present");
    }
  }

  private createCanvas(rootId: string, height: number, width: number) {
    const rootElement = document.getElementById(rootId);

    if (!rootElement) {
      Log.error(TAG, "Could not locate rootElement");
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    canvas.style.border = "2px solid black";

    rootElement.appendChild(canvas);
    this.canvas2D = canvas.getContext("2d");
    return canvas;
  }

  run() {
    requestAnimationFrame(this.loop);
  }

  private loop = (currentTime: number) => {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.accumulatedTime += deltaTime;

    if (this.accumulatedTime > this.targetDeltaTime) {
      this.accumulatedTime -= this.targetDeltaTime;
      this.tickInternal(this.targetDeltaTime);
      if (this.canvas2D) {
        this.renderInternal(this.canvas2D);
      }
    }

    this.lastTime = currentTime;
    requestAnimationFrame(this.loop);
  };

  tickInternal(deltaTime: number) {
    this.tick(deltaTime);
    this.currentWorld?.tick(deltaTime);
  }

  tick(_deltaTime: number) {}

  renderInternal(canvas2D: CanvasRenderingContext2D) {
    canvas2D?.clearRect(
      0,
      0,
      this.canvas?.width || 0,
      this.canvas?.height || 0
    );
    this.render(canvas2D);
    this.currentWorld?.render(canvas2D);
  }
  render(_canvas2D: CanvasRenderingContext2D) {}

  getCurrentWorld() {
    return this.currentWorld;
  }
  setCurrentWorld(world: World) {
    this.currentWorld = world;
  }

  getCanvasSize() {
    const canvasClientRect = this.canvas?.getBoundingClientRect();
    return {
      height: canvasClientRect?.height || 0,
      width: canvasClientRect?.width || 0,
    };
  }

  getCanvasClientRect() {
    return this.canvas2D;
  }
}

export default Application;
