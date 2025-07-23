
export class SquareRetryManager {
  private currentAttempt = 0;
  private maxAttempts = 3;
  private baseDelay = 1000;

  getNextStrategy() {
    if (this.currentAttempt >= this.maxAttempts) {
      return null;
    }

    this.currentAttempt++;
    return {
      attempt: this.currentAttempt,
      maxAttempts: this.maxAttempts,
      delay: this.baseDelay * Math.pow(2, this.currentAttempt - 1)
    };
  }

  getCurrentAttempt(): number {
    return this.currentAttempt;
  }

  reset(): void {
    this.currentAttempt = 0;
  }
}
