import { CMCQuotesResponse } from "./types";

export const getQuote = async (
    symbolId: string,
    convertId: string,
): Promise<CMCQuotesResponse> => {
    const response = await fetch(
        `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${symbolId}&convert_id=${convertId}`,
        {
            headers: {
                "X-CMC_PRO_API_KEY": process.env["CMC_API_KEY"] || "",
            },
        },
    );

    const data = await response.json() as CMCQuotesResponse;

    return data;
};
