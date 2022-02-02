import "dotenv/config";

const AVOID_RETWIETERS = process.env.ONE.split("-");

export const AVOID_LIST = new Set(AVOID_RETWIETERS);
