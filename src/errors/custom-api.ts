class CustomApiError extends Error {
  public statusCode!: number;

  constructor(message: string) {
    super(message);
  }
}

export default CustomApiError;
