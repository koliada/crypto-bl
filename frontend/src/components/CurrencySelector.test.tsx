import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencySelector from './CurrencySelector';

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('CurrencySelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'OK',
        message: 'Quotes retrieved successfully',
        data: {
          symbol_id: '1',
          convert_id: '2781',
          quote: 50000.123456,
          requested_at: Date.now(),
        },
      }),
    } as Response);
  });

  it('should swap currencies when swap button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<CurrencySelector />);

    // Wait for initial render and API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Get the currency buttons and swap button
    const currencyButtons = screen.getAllByRole('button');
    const fromCurrencyButton = currencyButtons[0];
    const swapButton = currencyButtons[1];
    const toCurrencyButton = currencyButtons[2];

    // Check initial state - TON and USDT
    expect(fromCurrencyButton).toHaveTextContent('TON');
    expect(toCurrencyButton).toHaveTextContent('USDT');

    // Click the swap button
    await user.click(swapButton);

    // Check that currencies have been swapped
    expect(fromCurrencyButton).toHaveTextContent('USDT');
    expect(toCurrencyButton).toHaveTextContent('TON');

    // Verify that a new API call was made with swapped currencies
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2); // Initial call + call after swap
    });

    // Verify the actual API calls made
    expect(mockFetch).toHaveBeenNthCalledWith(1, 'http://localhost:3001/api/quotes/11419/825'); // TON to USDT
    expect(mockFetch).toHaveBeenNthCalledWith(2, 'http://localhost:3001/api/quotes/825/11419'); // USDT to TON
  });

  it('should maintain swap functionality after multiple clicks', async () => {
    const user = userEvent.setup();
    
    render(<CurrencySelector />);

    // Wait for initial render
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    const currencyButtons = screen.getAllByRole('button');
    const fromCurrencyButton = currencyButtons[0];
    const swapButton = currencyButtons[1];
    const toCurrencyButton = currencyButtons[2];

    // Initial state
    expect(fromCurrencyButton).toHaveTextContent('TON');
    expect(toCurrencyButton).toHaveTextContent('USDT');

    // First swap
    await user.click(swapButton);
    expect(fromCurrencyButton).toHaveTextContent('USDT');
    expect(toCurrencyButton).toHaveTextContent('TON');

    // Second swap - should return to original
    await user.click(swapButton);
    expect(fromCurrencyButton).toHaveTextContent('TON');
    expect(toCurrencyButton).toHaveTextContent('USDT');

    // Third swap
    await user.click(swapButton);
    expect(fromCurrencyButton).toHaveTextContent('USDT');
    expect(toCurrencyButton).toHaveTextContent('TON');

    // Verify all API calls made during multiple swaps
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(4); // Initial + 3 swaps
    });

    expect(mockFetch).toHaveBeenNthCalledWith(1, 'http://localhost:3001/api/quotes/11419/825'); // TON to USDT
    expect(mockFetch).toHaveBeenNthCalledWith(2, 'http://localhost:3001/api/quotes/825/11419'); // USDT to TON
    expect(mockFetch).toHaveBeenNthCalledWith(3, 'http://localhost:3001/api/quotes/11419/825'); // TON to USDT
    expect(mockFetch).toHaveBeenNthCalledWith(4, 'http://localhost:3001/api/quotes/825/11419'); // USDT to TON
  });

  it('should trigger new API call when currencies are swapped', async () => {
    const user = userEvent.setup();
    
    render(<CurrencySelector />);

    // Wait for initial API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Get the swap button
    const currencyButtons = screen.getAllByRole('button');
    const swapButton = currencyButtons[1];
    
    // Click swap button
    await user.click(swapButton);

    // Wait for new API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    // Verify the actual API calls made
    expect(mockFetch).toHaveBeenNthCalledWith(1, 'http://localhost:3001/api/quotes/11419/825'); // TON to USDT
    expect(mockFetch).toHaveBeenNthCalledWith(2, 'http://localhost:3001/api/quotes/825/11419'); // USDT to TON
  });
});
