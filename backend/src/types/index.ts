import { NextFunction, Request, Response } from "express";

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data?: T;
  timestamp?: string;
}

export interface HealthResponse extends ApiResponse {
  status: "OK" | "ERROR";
}

export interface ErrorResponse extends ApiResponse {
  status: "error";
  error: string;
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export interface EnvironmentVariables {
  NODE_ENV: "development" | "production" | "test";
  PORT: string;
  DATABASE_URL: string;
  CMC_API_KEY: string;
}
