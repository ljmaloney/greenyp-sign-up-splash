
export class SquareRetryManager {
  private currentAttempt = 0;
  private maxAttempts = 3;

  getCurrentAttempt() {
    return this.currentAttempt;
  }

  getNextStrategy() {
    if (this.currentAttempt >= this.maxAttempts) {
      return null;
    }

    this.currentAttempt++;
    return {
      attempt: this.currentAttempt,
      maxAttempts: this.maxAttempts,
      delay: 1000 * this.currentAttempt
    };
  }

  reset() {
    this.currentAttempt = 0;
  }
}
