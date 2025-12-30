export class UnauthenticatedError extends Error {
  public static message = "Unauthenticated";
  constructor(message: string = UnauthenticatedError.message) {
    super(message);
  }
}
