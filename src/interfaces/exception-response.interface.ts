export interface ExceptionResponse<T = any> {
  errors: {
    status: number;
    title: string;
    details: T;
  }[];
}
