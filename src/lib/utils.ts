import type { OrderType } from "./mongoose/schemas";

export type SuccessResponse<T = any> = {
  message: string;
  data: T;
};

export type SuccessResponseWithPagination<T = any> = {
  message: string;
  data: T;
  pagination: PaginationResponse;
};

export const createResponse = <T = any>(data: T): SuccessResponse<T> => {
  return {
    message: "",
    data,
  };
};

export const createResponseWithPagination = <T = any>(
  data: T,
  pagination: PaginationResponse
): SuccessResponseWithPagination<T> => {
  return {
    message: "",
    data,
    pagination,
  };
};

export type PaginationProps = {
  page: string;
  limit: string;
  total: number;
};

export type PaginationResponse = {
  skip: number;
  limit: number;
  pages: number;
  total: number;
  currentPage: number;
  nextPage: number | undefined;
  previousPage: number | undefined;
};

export const createPagination = ({
  page,
  limit,
  total,
}: {
  page: string;
  limit: string;
  total: number;
}): PaginationResponse => {
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skipNumber = (pageNumber - 1) * limitNumber;
  const pagesTotal = Math.ceil(total / limitNumber);

  const currentPage = pageNumber;
  const nextPage = pageNumber + 1;
  const previousPage = pageNumber - 1;

  return {
    skip: skipNumber,
    limit: limitNumber,
    pages: pagesTotal,
    total,
    currentPage,
    nextPage: nextPage > pagesTotal ? undefined : nextPage,
    previousPage: previousPage < 1 ? undefined : previousPage,
  };
};

export const advanceOrderState = (state: OrderType["state"]) => {
  switch (state) {
    case "CREATED":
      return "ANALYSIS";
    case "ANALYSIS":
      return "COMPLETED";
    default:
      return state;
  }
};
