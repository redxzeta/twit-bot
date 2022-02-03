import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";

const AVOID_RETWIETERS = process.env.ONE.split("-");

export const AVOID_LIST = new Set(AVOID_RETWIETERS);

export const userClient = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN_KEY,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

export const TWITTER_LIST_ID = process.env.LISTID;

export const CURRENT_USER_ID = process.env.CURRENT_USER;

export const INTERVAL = Number(process.env.INTERVAL);

export const SOLUTION = Number(process.env.SOLUTION);
