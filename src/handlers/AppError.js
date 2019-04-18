class AppError {
  constructor(message, statusCode, isOperational, title) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.message = message;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.title = title;
  }

  static error(message, statusCode, isOperational) {
    return new AppError(message, statusCode, isOperational);
  }
}

AppError.constructor.prototype.__proto__ = Error.prototype;

export default AppError;
