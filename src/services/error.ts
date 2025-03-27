/**
 * FeiShu API Error Types
 */

/**
 * Base error for FeiShu API issues
 */
export class FeiShuApiError extends Error {
  /**
   * Create a new FeiShu API error
   *
   * @param message - Error message
   * @param code - Error code from API response (optional)
   */
  constructor(
    message: string,
    public code?: number,
  ) {
    super(message);
    this.name = 'FeiShuApiError';
  }
}

/** Authentication error */
export class FeiShuAuthError extends FeiShuApiError {
  constructor(message: string, code?: number) {
    super(message, code);
    this.name = 'FeiShuAuthError';
  }
}

/** Rate limit error */
export class FeiShuRateLimitError extends FeiShuApiError {
  constructor(message: string, code?: number) {
    super(message, code);
    this.name = 'FeiShuRateLimitError';
  }
}

/** Permission error */
export class FeiShuPermissionError extends FeiShuApiError {
  constructor(message: string, code?: number) {
    super(message, code);
    this.name = 'FeiShuPermissionError';
  }
}
