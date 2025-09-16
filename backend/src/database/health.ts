import { getDatabaseConnection } from "./connection";
import { env } from "../env";

export const healthCheck = async () => {
    return await getDatabaseConnection(env).healthCheck();
};