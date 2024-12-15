export function SuccessStatus(
  data: any,
  message: string = 'Success',
  statusCode: number = 200,
) {
  return {
    statusCode,
    message,
    data,
  };
}

export function ErrorStatus(
  message: string,
  statusCode: number = 500,
  error: any = null,
) {
  return {
    statusCode,
    message,
    error: error || message,
  };
}
