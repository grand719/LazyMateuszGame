import ScoreManager from "../scoreManager/ScoreManager";

class TypoMaster {
  private static instance: TypoMaster;
  private shouldBlockEventMovement = false;
  private isGameStarted = false;
  private sentences: string[] = [];
  private currentSentence = "";
  private userInput = "";
  private timeLeft = 10;
  private score = 0;
  private timerId?: number;
  private isWorkType?: boolean;

  reset() {
    this.shouldBlockEventMovement = false;
    this.isGameStarted = false;
    this.sentences = [];
    this.currentSentence = "";
    this.userInput = "";
    this.timeLeft = 10;
    this.score = 0;
    this.timerId = undefined;
    this.isWorkType = undefined;
  }

  private constructor() {
    window.addEventListener("keydown", this.onKeyPress);
  }

  public getShouldBlockMovement() {
    return this.shouldBlockEventMovement;
  }

  public render(canvas2D: CanvasRenderingContext2D) {
    if (!this.isGameStarted) return;

    const canvasWidth = canvas2D.canvas.width;
    const canvasHeight = canvas2D.canvas.height;
    const windowWidth = 400;
    const windowHeight = 200;
    const windowX = (canvasWidth - windowWidth) / 2;
    const windowY = (canvasHeight - windowHeight) / 2;

    canvas2D.fillStyle = "#808080";
    canvas2D.fillRect(windowX, windowY, windowWidth, windowHeight);
    canvas2D.strokeStyle = "#000";
    canvas2D.lineWidth = 2;
    canvas2D.strokeRect(windowX, windowY, windowWidth, windowHeight);

    canvas2D.font = "20px Arial";
    canvas2D.fillStyle = "black";
    canvas2D.fillText(
      `Phrase: ${this.currentSentence}`,
      windowX + 20,
      windowY + 50
    );

    canvas2D.fillStyle = "blue";
    canvas2D.fillText(`Input: ${this.userInput}`, windowX + 20, windowY + 90);

    canvas2D.fillStyle = "red";
    canvas2D.fillText(
      `Time Left: ${this.timeLeft.toFixed(1)}s`,
      windowX + 20,
      windowY + 130
    );

    canvas2D.fillStyle = "green";
    canvas2D.fillText(`Score: ${this.score}`, windowX + 20, windowY + 170);
  }

  public tick(deltaTime: number) {
    if (!this.isGameStarted) return;

    this.timeLeft -= deltaTime;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.endSentence();
    }
  }

  public startGame(sentences: string[], isWorkType?: boolean) {
    this.sentences = this.getRandomWords(sentences, 5);
    this.score = 0;
    this.isGameStarted = true;
    this.shouldBlockEventMovement = true;
    this.isWorkType = isWorkType;
    this.nextSentence();
  }

  public getIsGameStarted() {
    return this.isGameStarted;
  }

  private getRandomWords(sentences: string[], count: number): string[] {
    const shuffled = [...sentences];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }

  private nextSentence() {
    if (this.sentences.length === 0) {
      this.endGame();
      return;
    }

    this.currentSentence = this.sentences.shift()!;
    this.userInput = "";
    this.timeLeft = 15;
  }

  private endSentence() {
    const correctLetters = this.calculateCorrectLetters();
    const missingLetters = this.currentSentence.length - correctLetters;

    this.score += correctLetters * 5;
    this.score -= missingLetters * 5;

    if (this.userInput === this.currentSentence) {
      this.score += 15;
    }

    this.nextSentence();
  }

  private calculateCorrectLetters(): number {
    let correctCount = 0;
    for (let i = 0; i < this.userInput.length; i++) {
      if (this.userInput[i] === this.currentSentence[i]) {
        correctCount++;
      }
    }
    return correctCount;
  }

  private endGame() {
    this.isGameStarted = false;
    setTimeout(() => {
      this.shouldBlockEventMovement = false;
    }, 200);
    clearInterval(this.timerId);

    if (this.score > 0) {
      ScoreManager.addMainScore();
      if (this.isWorkType === undefined) return;
      if (this.isWorkType) {
        ScoreManager.addWorkingScore();
      } else {
        ScoreManager.addSlackingOffScore();
      }
    }
  }

  private onKeyPress = (event: KeyboardEvent) => {
    if (!this.isGameStarted) return;

    const key = event.key;

    if (key === "Backspace") {
      this.userInput = this.userInput.slice(0, -1);
      return;
    }

    if (/^[a-zA-Z0-9]$/.test(key)) {
      this.userInput += key;

      if (this.userInput.length >= this.currentSentence.length) {
        this.endSentence();
      }
    }
  };

  public getIsWorkType() {
    return this.isWorkType;
  }

  public static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new TypoMaster();

    return this.instance;
  }
}

export default TypoMaster.getInstance();
