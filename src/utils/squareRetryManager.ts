
interface RetryStrategy {
  attempt: number;
  delay: number;
  maxAttempts: number;
  reason?: string;
}

interface RetryManagerOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

export class SquareRetryManager {
  private currentAttempt = 0;
  private readonly maxAttempts: number;
  private readonly baseDelay: number;
  private readonly maxDelay: number;
  private readonly backoffMultiplier: number;

  constructor(options: RetryManagerOptions = {}) {
    this.maxAttempts = options.maxAttempts || 5;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 8000;
    this.backoffMultiplier = options.backoffMultiplier || 1.5;
  }

  canRetry(): boolean {
    return this.currentAttempt < this.maxAttempts;
  }

  getNextStrategy(): RetryStrategy | null {
    if (!this.canRetry()) {
      return null;
    }

    this.currentAttempt++;
    
    // Calculate progressive delay
    let delay = this.baseDelay * Math.pow(this.backoffMultiplier, this.currentAttempt - 1);
    delay = Math.min(delay, this.maxDelay);

    return {
      attempt: this.currentAttempt,
      delay: Math.round(delay),
      maxAttempts: this.maxAttempts,
      reason: this.getRetryReason(this.currentAttempt)
    };
  }

  private getRetryReason(attempt: number): string {
    switch (attempt) {
      case 1:
        return 'Initial attempt';
      case 2:
        return 'Quick retry - network delay';
      case 3:
        return 'SDK loading retry';
      case 4:
        return 'Container detection retry';
      default:
        return 'Final attempt';
    }
  }

  reset(): void {
    this.currentAttempt = 0;
  }

  getCurrentAttempt(): number {
    return this.currentAttempt;
  }

  getRemainingAttempts(): number {
    return Math.max(0, this.maxAttempts - this.currentAttempt);
  }
}
