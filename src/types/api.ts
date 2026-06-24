export interface SuccessResponse<T> {
  status: "success";
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  status: "success";
  message?: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  status: "error";
  message: string;
  errors?: {
    field?: string;
    message: string;
  }[];
}
