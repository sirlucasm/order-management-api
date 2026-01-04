import z from "zod";

export class ErrorResponse extends Error {
  constructor(
    public override message: string,
    public statusCode: number,
    error?: any
  ) {
    super(message);
    this.statusCode = statusCode;

    if (error instanceof z.ZodError) {
      this.message = z.prettifyError(error);
      this.statusCode = 400;
    }
  }

  serializeErrors() {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
