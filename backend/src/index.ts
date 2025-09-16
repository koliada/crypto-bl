import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { 
  // ApiResponse, 
  HealthResponse, 
  ErrorResponse,
  // AsyncRequestHandler,
  EnvironmentVariables, 
  CMCQuotesResponse
} from './types/index.js';
import { getDatabaseConnection } from './database/connection.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT: number = parseInt(process.env['PORT'] || '3001', 10);

// Type-safe environment variables
const env: EnvironmentVariables = {
  NODE_ENV: (process.env['NODE_ENV'] as EnvironmentVariables['NODE_ENV']) || 'development',
  PORT: process.env['PORT'] || '3001',
  DATABASE_URL: process.env['DATABASE_URL'] || 'postgresql://postgres:postgres@localhost:5432/crypto_bl'
};

// Initialize database connection
const db = getDatabaseConnection(env);

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', async (_req: Request, res: Response<HealthResponse>) => {
  const dbHealthy = await db.healthCheck();
  const response: HealthResponse = {
    status: dbHealthy ? 'OK' : 'ERROR',
    message: dbHealthy ? 'Backend and database are running' : 'Backend running but database connection failed',
    timestamp: new Date().toISOString()
  };
  res.json(response);
});

// Quotes endpoint
app.get('/api/quotes/:symbol_id/:convert_id', async (req: Request<{ symbol_id: string, convert_id: string }>, res: Response) => {
  try {
    const { symbol_id, convert_id } = req.params;
    
    let quotes = await db.query('SELECT symbol_id, convert_id, quote, requested_at FROM quotes WHERE symbol_id = $1 AND convert_id = $2 AND requested_at > NOW() - INTERVAL \'30 minutes\' ORDER BY requested_at DESC LIMIT 1', [symbol_id, convert_id]);

    if (quotes.length === 0) {
      // Fetch quote from CMC API
      const quoteResponse = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${symbol_id}&convert_id=${convert_id}`, {
        headers: {
          'X-CMC_PRO_API_KEY': process.env['CMC_API_KEY'] || ''
        }
      });
      const quoteData = await quoteResponse.json() as CMCQuotesResponse;
      const quote = quoteData.data[symbol_id]?.quote[convert_id]?.price;
      
      if (!quote) {
        console.error('Quote not found for symbol_id:', symbol_id, 'and convert_id:', convert_id);
        return res.status(404).json({
          status: 'error',
          error: 'Quote not found',
          message: 'Quote not found'
        });
      }

      const result = await db.query('INSERT INTO quotes (symbol_id, convert_id, quote) VALUES ($1, $2, $3) RETURNING symbol_id, convert_id, quote, requested_at', [symbol_id, convert_id, quote]);
      quotes = [result[0]];
    }
    
    return res.json({
      status: 'OK',
      message: 'Quotes retrieved successfully',
      data: quotes[0]
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return res.status(500).json({
      status: 'error',
      error: 'Failed to fetch quotes',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) => {
  console.error(err.stack);
  const response: ErrorResponse = {
    status: 'error',
    error: 'Something went wrong!',
    message: env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  };
  res.status(500).json(response);
});

// 404 handler
app.use('*', (_req: Request, res: Response<ErrorResponse>) => {
  const response: ErrorResponse = {
    status: 'error',
    error: 'Route not found',
    message: 'Route not found'
  };
  res.status(404).json(response);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🗄️  Database: ${env.DATABASE_URL.split('@')[1] || 'Not configured'}`);
});
