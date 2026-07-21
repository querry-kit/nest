export function isKnownRequestErrorLike(error: unknown): error is Error & { code: string; meta?: unknown } {
  return error instanceof Error && typeof (error as { code?: unknown }).code === 'string';
}
