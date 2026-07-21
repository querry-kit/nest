export function isForbiddenLike(error: unknown): boolean {
  return error instanceof Error && (error.name === 'ForbiddenError' || error.name === 'ForbiddenErrorType');
}
