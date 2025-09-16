import request from 'supertest';
import { app } from '../index';
import { getQuotes, insertQuote } from '../database/quotes';
import { getQuote } from '../services/cmc';
import { CMCQuotesResponse } from '../services/cmc/types';

// Mock the database and external service modules
jest.mock('../database/quotes');
jest.mock('../services/cmc');

const mockGetQuotes = getQuotes as jest.MockedFunction<typeof getQuotes>;
const mockInsertQuote = insertQuote as jest.MockedFunction<typeof insertQuote>;
const mockGetQuote = getQuote as jest.MockedFunction<typeof getQuote>;

describe('/api/quotes/:symbol_id/:convert_id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when we have a recent quote', () => {
    it('should return the existing quote from database', async () => {
      const mockQuote = {
        symbol_id: '1',
        convert_id: '2781',
        quote: 50000.123456,
        requested_at: new Date().toISOString(),
      };

      mockGetQuotes.mockResolvedValue([mockQuote]);

      const response = await request(app)
        .get('/api/quotes/1/2781')
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        message: 'Quotes retrieved successfully',
        data: mockQuote,
      });

      expect(mockGetQuotes).toHaveBeenCalledWith('1', '2781', '30 minutes');
      expect(mockGetQuote).not.toHaveBeenCalled();
      expect(mockInsertQuote).not.toHaveBeenCalled();
    });
  });

  describe('when we don\'t have a recent quote', () => {
    it('should fetch from CMC API and insert new quote to database', async () => {
      const mockCMCResponse = {
        data: {
          '1': {
            id: '1',
            quote: {
              '2781': {
                price: 50000.123456,
              },
            },
          },
        },
      };

      const mockInsertedQuote = {
        symbol_id: '1',
        convert_id: '2781',
        quote: 50000.123456,
        requested_at: new Date().toISOString(),
      };

      mockGetQuotes.mockResolvedValue([]);
      mockGetQuote.mockResolvedValue(mockCMCResponse);
      mockInsertQuote.mockResolvedValue(mockInsertedQuote);

      const response = await request(app)
        .get('/api/quotes/1/2781')
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        message: 'Quotes retrieved successfully',
        data: mockInsertedQuote,
      });

      expect(mockGetQuotes).toHaveBeenCalledWith('1', '2781', '30 minutes');
      expect(mockGetQuote).toHaveBeenCalledWith('1', '2781');
      expect(mockInsertQuote).toHaveBeenCalledWith('1', '2781', 50000.123456);
    });

    it('should return 404 when CMC API does not return quote data', async () => {
      const mockCMCResponse = {
        data: {
          '1': {
            id: '1',
            quote: {
              '2781': {
                // No price field
              },
            },
          },
        },
      };

      mockGetQuotes.mockResolvedValue([]);
      mockGetQuote.mockResolvedValue(mockCMCResponse as any as CMCQuotesResponse);

      const response = await request(app)
        .get('/api/quotes/1/2781')
        .expect(404);

      expect(response.body).toEqual({
        status: 'error',
        error: 'Quote not found',
        message: 'Quote not found',
      });

      expect(mockGetQuotes).toHaveBeenCalledWith('1', '2781', '30 minutes');
      expect(mockGetQuote).toHaveBeenCalledWith('1', '2781');
      expect(mockInsertQuote).not.toHaveBeenCalled();
    });

    it('should return 500 when CMC API throws an error', async () => {
      mockGetQuotes.mockResolvedValue([]);
      mockGetQuote.mockRejectedValue(new Error('CMC API Error'));

      const response = await request(app)
        .get('/api/quotes/1/2781')
        .expect(500);

      expect(response.body).toEqual({
        status: 'error',
        error: 'Failed to fetch quotes',
        message: 'CMC API Error',
      });

      expect(mockGetQuotes).toHaveBeenCalledWith('1', '2781', '30 minutes');
      expect(mockGetQuote).toHaveBeenCalledWith('1', '2781');
      expect(mockInsertQuote).not.toHaveBeenCalled();
    });
  });
});
