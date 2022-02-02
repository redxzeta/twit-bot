import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";

const TWITTER_LIST_ID = process.env.LISTID;

const CURRENT_USER_ID = process.env.CURRENT_USER;

const INTERVAL = Number(process.env.INTERVAL);

const SOLUTION = Number(process.env.SOLUTION);

const userClient = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN_KEY,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

const funStuff = async () => {
  const tweets = await userClient.v2.listTweets(TWITTER_LIST_ID, {
    max_results: SOLUTION,
  });

  await Promise.all(
    tweets.data.data.map(async (tweet) => {
      await userClient.v2.like(CURRENT_USER_ID, tweet.id);
      await userClient.v2.retweet(CURRENT_USER_ID, tweet.id);
      console.log("success");
    })
  );
};
console.log("running");
setInterval(() => {
  funStuff();
}, INTERVAL);
