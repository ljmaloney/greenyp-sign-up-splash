
interface RetryStrategy {
  attempt: number;
  maxAttempts: number;
  delay: number;
}

export class SquareRetryManager {
  private currentAttempt = 0;
  private readonly maxAttempts = 3;
  private readonly baseDelay = 1000; // 1 second

  reset(): void {
    this.currentAttempt = 0;
  }

  getCurrentAttempt(): number {
    return this.currentAttempt;
  }

  getNextStrategy(): RetryStrategy | null {
    if (this.currentAttempt >= this.maxAttempts) {
      return null;
    }

    this.currentAttempt++;
    
    return {
      attempt: this.currentAttempt,
      maxAttempts: this.maxAttempts,
      delay: this.baseDelay * this.currentAttempt // Progressive delay
    };
  }
}
