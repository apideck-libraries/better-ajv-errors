export interface ValidationError {
  message: string;
  path: string;
  suggestion?: string;
  context?: Record<string, unknown>;
}
