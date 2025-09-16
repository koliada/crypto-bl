import dotenv from "dotenv";
import { EnvironmentVariables } from "./types";

dotenv.config();

export const env: EnvironmentVariables = {
  NODE_ENV: (process.env['NODE_ENV'] as EnvironmentVariables['NODE_ENV']) || 'development',
  PORT: process.env['PORT'] || '3001',
  DATABASE_URL: process.env['DATABASE_URL'] || 'postgresql://postgres:postgres@localhost:5432/crypto_bl',
  CMC_API_KEY: process.env['CMC_API_KEY'] || '',
};