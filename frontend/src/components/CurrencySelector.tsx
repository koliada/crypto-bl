import { useState, useEffect } from "react";
import styled from "styled-components";
import { Card } from "./UI";
import type { CurrencyId, Quote } from "../types";
import { CURRENCY_IDS, API_URL } from "../const";

const CurrencySelectorContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
`;

const CurrencyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CurrencyButton = styled.button`
  flex: 1;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  color: #4a5568;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #667eea;
    background: #f8fafc;
  }
`;

const SwapButton = styled.button`
  width: 48px;
  height: 48px;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  background: white;
  color: #4a5568;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #667eea;
    color: #667eea;
    transform: rotate(180deg);
  }
`;

const QuoteDisplay = styled.div`
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const QuoteValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const QuoteTime = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

function formatRelativeTime(timestamp: number) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
}

function CurrencySelector() {
  const [fromCurrency, setFromCurrency] = useState<CurrencyId>("TON");
  const [toCurrency, setToCurrency] = useState<CurrencyId>("USDT");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);

    try {
      const fromId = CURRENCY_IDS[fromCurrency];
      const toId = CURRENCY_IDS[toCurrency];

      const response = await fetch(`${API_URL}/api/quotes/${fromId}/${toId}`);
      const data = await response.json();

      if (data.status === "OK") {
        setQuote(data.data);
      } else {
        setError(data.message || "Failed to fetch quote");
      }
    } catch (err) {
      setError("Network error: " + (err as Error).message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Fetch quote when component mounts or currencies change
  useEffect(() => {
    fetchQuote();
  }, [fromCurrency, toCurrency]);

  return (
    <CurrencySelectorContainer>
      <h3 style={{ margin: "0 0 1rem 0", color: "#1a202c" }}>
        Currency Exchange
      </h3>

      <CurrencyRow>
        <CurrencyButton>
          {fromCurrency}
        </CurrencyButton>

        <SwapButton onClick={swapCurrencies} title="Swap currencies">
          ⇄
        </SwapButton>

        <CurrencyButton>
          {toCurrency}
        </CurrencyButton>
      </CurrencyRow>

      {loading && (
        <QuoteDisplay>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <LoadingSpinner />
            <span>Loading quote...</span>
          </div>
        </QuoteDisplay>
      )}

      {quote && !loading && (
        <QuoteDisplay>
          <QuoteValue>
            1 {fromCurrency} = {Number(quote.quote).toFixed(6)} {toCurrency}
          </QuoteValue>
          <QuoteTime>
            Last updated: {formatRelativeTime(quote.requested_at)}
          </QuoteTime>
        </QuoteDisplay>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </CurrencySelectorContainer>
  );
}

export default CurrencySelector;
