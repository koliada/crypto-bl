import { CURRENCY_IDS } from "./const";

declare global {
    interface ImportMeta {
        env: {
            VITE_API_URL?: string;
        };
    }
}

export type ServerStatus = "connected" | "error" | "checking";

export interface Quote {
    symbol_id: string;
    convert_id: string;
    quote: number;
    requested_at: number;
}

export type CurrencyId = keyof typeof CURRENCY_IDS;