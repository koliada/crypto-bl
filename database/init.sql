-- Initialize the crypto_bl database
-- This script runs automatically when the PostgreSQL container starts

-- Create the quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  symbol_id VARCHAR(50) NOT NULL,
  convert_id VARCHAR(50) NOT NULL,
  quote NUMERIC NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
-- CREATE INDEX IF NOT EXISTS idx_quotes_symbol_id ON quotes(symbol_id);
-- CREATE INDEX IF NOT EXISTS idx_quotes_convert_id ON quotes(convert_id);
-- CREATE INDEX IF NOT EXISTS idx_quotes_requested_at ON quotes(requested_at);
CREATE INDEX IF NOT EXISTS idx_quotes_symbol_convert ON quotes(symbol_id, convert_id);

-- Add comments for documentation
COMMENT ON TABLE quotes IS 'Stores cryptocurrency quote data with symbol and conversion information';
COMMENT ON COLUMN quotes.symbol_id IS 'The CMC ID';
COMMENT ON COLUMN quotes.convert_id IS 'The CMC ID';
COMMENT ON COLUMN quotes.quote IS 'The quote value';
COMMENT ON COLUMN quotes.requested_at IS 'When the quote was requested';
