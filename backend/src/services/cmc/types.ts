export interface CMCQuotesResponse {
    data: Record<string, {
        id: string;
        quote: Record<string, {
            price: number;
        }>;
    }>;
}
