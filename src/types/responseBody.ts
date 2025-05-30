
// Generic API response
export interface APIResponse<T> {
    response: T;
    errorMessageApi: string | null;
}
