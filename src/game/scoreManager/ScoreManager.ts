class ScoreManager {
  private mainScore: number;
  private workingScore: number;
  private slackingOffScore: number;
  private timeAccumulator: number;

  private gameEndCallback?: (totalPoints: number) => void;

  reset() {
    this.mainScore = 0;
    this.workingScore = 100;
    this.slackingOffScore = 100;
    this.timeAccumulator = 0;

    this.gameEndCallback = undefined;
  }

  constructor() {
    this.mainScore = 0;
    this.workingScore = 100;
    this.slackingOffScore = 100;
    this.timeAccumulator = 0;
  }

  tick(deltaTime: number) {
    this.timeAccumulator += deltaTime;

    if (this.timeAccumulator >= 1) {
      const ticks = Math.floor(this.timeAccumulator);
      this.mainScore += ticks;
      this.workingScore -= ticks;
      this.slackingOffScore -= 2 * ticks;
      this.timeAccumulator -= ticks;
    }

    if (this.slackingOffScore < 0 || this.workingScore < 0) {
      this.gameEndCallback?.(this.mainScore);
    }
  }

  render(canvas2D: CanvasRenderingContext2D): void {
    canvas2D.fillStyle = "#000";
    canvas2D.font = "20px Arial";
    canvas2D.fillText(`Main Score: ${this.getMainScore()}`, 5, 820);
    canvas2D.fillText(`Working Score: ${this.getWorkingScore()}`, 455, 820);
    canvas2D.fillText(
      `Slacking Off Score: ${this.getSlackingOffScore()}`,
      205,
      820
    );
  }

  getMainScore(): number {
    return this.mainScore;
  }

  getWorkingScore(): number {
    return this.workingScore;
  }

  getSlackingOffScore(): number {
    return this.slackingOffScore;
  }

  addSlackingOffScore() {
    this.slackingOffScore += 50;
  }

  addWorkingScore() {
    this.workingScore += 30;
  }

  subtractSlackingOffScore() {
    this.slackingOffScore -= 15;
  }

  addMainScore() {
    this.mainScore += 30;
  }

  setGameEndCallback(callback: (totalPoints: number) => void) {
    this.gameEndCallback = callback;
  }

  resetScores() {
    this.mainScore = 0;
    this.workingScore = 100;
    this.slackingOffScore = 100;
    this.timeAccumulator = 0;
  }
}

export default new ScoreManager();
