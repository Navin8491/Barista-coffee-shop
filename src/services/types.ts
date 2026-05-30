export interface ServiceResponse<T> {
  data: T | null;
  error: Error | { message: string } | null;
}
