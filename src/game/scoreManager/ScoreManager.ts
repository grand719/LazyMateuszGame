class ScoreManager {
    private mainScore: number;
    private workingScore: number;
    private slackingOffScore: number;
    private lastUpdateTime: number;
  
    constructor() {
      this.mainScore = 0;
      this.workingScore = 100;
      this.slackingOffScore = 100;
      this.lastUpdateTime = Date.now();
    }
  
    updateScores() {
      const currentTime = Date.now();
      const deltaTime = (currentTime - this.lastUpdateTime) / 1000; 
  
      if (deltaTime >= 1) {
        this.mainScore += Math.floor(deltaTime); 
        this.workingScore -= Math.floor(deltaTime); 
        this.slackingOffScore -= 2 * Math.floor(deltaTime); 
  
        this.lastUpdateTime = currentTime; 
      }
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
  
    resetScores() {
      this.mainScore = 0;
      this.workingScore = 100;
      this.slackingOffScore = 100;
    }
  }
  
  export default new ScoreManager();
  