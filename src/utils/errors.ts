import { databaseErrors } from "./dbErrors.js";

export class errorResponses extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isoperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
    this.isOperational = isoperational;

    Error.captureStackTrace(this, this.constructor);
  }

  // 1xx informational response
  static continue100(message = "Continue") {
    return new errorResponses(message, 100);
  }

  static switchingProtocols(message = "Switching protocols") {
    return new errorResponses(message, 101);
  }

  static processing(message = "Processing") {
    return new errorResponses(message, 102);
  }

  // 2xx success response
  static ok(message = "OK") {
    return new errorResponses(message, 200);
  }
  static created(message = "Created") {
    return new errorResponses(message, 201);
  }
  static accepted(message = "Accepted") {
    return new errorResponses(message, 202);
  }

  //3x redirection response
  static multipleChoices(message = "Multiple Choices") {
    return new errorResponses(message, 300);
  }
  static found(message = 'Found (Previously "Moved Temporarily")') {
    return new errorResponses(message, 302);
  }

  static notModified(message = "Not Modified") {
    return new errorResponses(message, 304);
  }

  //4xx client side errors
  static badRequest(message = "Bad Request") {
    return new errorResponses(message, 400);
  }

  static unauthorized(message = "Unauthorized") {
    return new errorResponses(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new errorResponses(message, 403);
  }

  static notFound(message = "Not Found") {
    return new errorResponses(message, 404);
  }

  static conflict(message = "Conflict") {
    return new errorResponses(message, 409);
  }

  // 5xx: Server Errors
  static internal(message = "Internal Server Error") {
    return new errorResponses(message, 500);
  }

  static notImplemented(message = "Not Implemented") {
    return new errorResponses(message, 501);
  }

  static badGateway(message = "Bad Gateway") {
    return new errorResponses(message, 502);
  }

  static serviceUnavailable(message = "Service Unavailable") {
    return new errorResponses(message, 503);
  }
}

export const sendError = (res: Response, error: any) => {
  // Handle operational errors (AppError instances)
  if (error instanceof errorResponses) {
    return res.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      message: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    });
  }

  //showing db errors
  const dbError = databaseErrors(error);

  if (dbError) {
    return res.status(dbError.statucCode).json({
      success: false,
      statusCode: dbError.statucCode,
      message: dbError.message,
      ...databaseErrors(dbError.errors ? { errors: dbError.errors } : {}),
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === "development" && {
        stack: error.stack,
        error: error,
      }),
    });
  }

  // Handle unknown errors
  console.error("Unexpected Error:", error);

  res.status(500).json({
    success: false,
    statusCode: 500,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : error.message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      error: error,
    }),
  });
};
