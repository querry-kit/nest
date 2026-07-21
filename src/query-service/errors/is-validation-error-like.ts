export function isValidationErrorLike(error: unknown): boolean {
  return error instanceof Error && error.name === 'PrismaClientValidationError';
}
