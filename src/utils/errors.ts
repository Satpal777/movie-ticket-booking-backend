export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
  
  static notFound(message = "Resource Not Found") {
    return new AppError(message, 404);
  }

  static internal(message = "Internal Server Error") {
    return new AppError(message, 500);
  }

  static badRequest(message:string = "Bad request") {
    return new AppError(message, 400);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401);
  }
  
  static conflict(message = "Conflict") {
    return new AppError(message, 409);
  }

  static forbidden(message = "forbidden") {
    return new AppError(message, 412);
  }

  static notfound(message = "notfound") {
    return new AppError(message, 412);
  }
}
