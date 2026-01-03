export class ErrorResponse extends Error {
  constructor(public override message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  serializeErrors() {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
