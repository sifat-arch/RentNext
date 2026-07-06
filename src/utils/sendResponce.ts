import { Response } from "express";

type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

interface TData<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: TMeta;
}

export const sendResponse = <T>(res: Response, data: TData<T>) => {
  const response = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta || null,
    data: data.data,
  };

  return res.status(data.statusCode).json(response);
};
