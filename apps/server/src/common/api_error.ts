export class ApiError extends Error {
  message: string;
  errors: string | string[];
  statusCode: number;

  constructor(
    message: string,
    statusCode = 400,
    errors: string | string[] = [],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}
