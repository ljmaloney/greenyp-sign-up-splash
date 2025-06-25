
// API error message structure
export interface APIErrorMessage {
  displayMessage: string;
  // Add other error properties if needed
}

// Generic API response
export interface APIResponse<T> {
    response: T;
    errorMessageApi: APIErrorMessage | null;
}
