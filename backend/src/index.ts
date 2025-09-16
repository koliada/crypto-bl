import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ErrorResponse, HealthResponse } from "./types";
import { getQuote } from "./services/cmc";
import { env } from "./env";
import { getQuotes, insertQuote } from "./database/quotes";
import { healthCheck } from "./database/health";

const app = express();
const PORT: number = parseInt(env.PORT, 10);

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === "production"
    ? ["https://yourdomain.com"]
    : ["http://localhost:3000"],
  credentials: true,
}));
app.use(morgan("combined"));
app.use(express.json());

// Routes
app.get("/api/health", async (_req: Request, res: Response<HealthResponse>) => {
  const dbHealthy = await healthCheck();
  const response: HealthResponse = {
    status: dbHealthy ? "OK" : "ERROR",
    message: dbHealthy
      ? "Backend and database are running"
      : "Backend running but database connection failed",
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// Quotes endpoint
app.get(
  "/api/quotes/:symbol_id/:convert_id",
  async (
    req: Request<{ symbol_id: string; convert_id: string }>,
    res: Response,
  ) => {
    try {
      const { symbol_id, convert_id } = req.params;

      let quotes = await getQuotes(symbol_id, convert_id, "30 minutes");

      if (quotes.length === 0) {
        // Fetch quote from CMC API
        const quoteData = await getQuote(symbol_id, convert_id);
        const quote = quoteData.data[symbol_id]?.quote[convert_id]?.price;

        if (!quote) {
          console.error(
            "Quote not found for symbol_id:",
            symbol_id,
            "and convert_id:",
            convert_id,
          );
          return res.status(404).json({
            status: "error",
            error: "Quote not found",
            message: "Quote not found",
          });
        }

        const result = await insertQuote(symbol_id, convert_id, quote);
        quotes = [result];
      }

      return res.json({
        status: "OK",
        message: "Quotes retrieved successfully",
        data: quotes[0],
      });
    } catch (error) {
      console.error("Error fetching quotes:", error);
      return res.status(500).json({
        status: "error",
        error: "Failed to fetch quotes",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Error handling middleware
app.use(
  (
    err: Error,
    _req: Request,
    res: Response<ErrorResponse>,
    _next: NextFunction,
  ) => {
    console.error(err.stack);
    const response: ErrorResponse = {
      status: "error",
      error: "Something went wrong!",
      message: env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
    };
    res.status(500).json(response);
  },
);

// 404 handler
app.use("*", (_req: Request, res: Response<ErrorResponse>) => {
  const response: ErrorResponse = {
    status: "error",
    error: "Route not found",
    message: "Route not found",
  };
  res.status(404).json(response);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(
    `🗄️  Database: ${env.DATABASE_URL.split("@")[1] || "Not configured"}`,
  );
});
