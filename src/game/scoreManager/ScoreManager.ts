class ScoreManager {
    private mainScore: number;
    private workingScore: number;
    private slackingOffScore: number;
    private timeAccumulator: number;
  
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
    }
  
    render(canvas2D: CanvasRenderingContext2D): void {
      canvas2D.fillStyle = "#000";
      canvas2D.font = "20px Arial";
      canvas2D.fillText(`Main Score: ${this.getMainScore()}`, 10, 30);
      canvas2D.fillText(`Working Score: ${this.getWorkingScore()}`, 10, 60);
      canvas2D.fillText(`Slacking Off Score: ${this.getSlackingOffScore()}`, 10, 90);
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

    increaseWorkingScore(amount: number) {
        this.workingScore += amount;
      }
      
    increaseSlackingOffScore(amount: number) {
        this.slackingOffScore += amount;
      }
    
    decreaseWorkingScore(amount: number) {
        this.workingScore -= amount;
      }
      
    decreaseSlackingOffScore(amount: number) {
        this.slackingOffScore -= amount;
      }
      
  
    resetScores() {
      this.mainScore = 0;
      this.workingScore = 100;
      this.slackingOffScore = 100;
      this.timeAccumulator = 0;
    }
  }
  
  export default new ScoreManager();
  