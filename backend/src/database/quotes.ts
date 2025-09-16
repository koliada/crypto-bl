import { env } from "../env";
import { getDatabaseConnection } from "./connection";

type Quote = {
    symbol_id: string;
    convert_id: string;
    quote: number;
    requested_at: string;
};

export const getQuotes = async (
    symbolId: string,
    convertId: string,
    interval: string,
): Promise<Quote[]> => {
    const db = getDatabaseConnection(env);
    const quotes = await db.query<Quote>(
        "SELECT symbol_id, convert_id, quote, requested_at FROM quotes WHERE symbol_id = $1 AND convert_id = $2 AND requested_at > NOW() - ($3)::interval ORDER BY requested_at DESC LIMIT 1",
        [symbolId, convertId, interval],
    );
    return quotes;
};

export const insertQuote = async (symbolId: string, convertId: string, quote: number): Promise<Quote> => {
    const db = getDatabaseConnection(env);
    const result = await db.query(
        "INSERT INTO quotes (symbol_id, convert_id, quote) VALUES ($1, $2, $3) RETURNING symbol_id, convert_id, quote, requested_at",
        [symbolId, convertId, quote],
    );
    return result[0];
};
