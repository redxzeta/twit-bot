import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";
import { AVOID_LIST } from "./funList.js";

const TWITTER_LIST_ID = process.env.LISTID;

const CURRENT_USER_ID = process.env.CURRENT_USER;

const INTERVAL = Number(process.env.INTERVAL);

const SOLUTION = Number(process.env.SOLUTION);

const MIN = 10;

const MAX = 39;

const MINUTE = 60000;

let runTimes = 0;

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
function getRandomArbitrary() {
  return Math.random() * (MAX - MIN) + MIN;
}

const userClient = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN_KEY,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

const funStuff = async () => {
  const tweets = await userClient.v2.listTweets(TWITTER_LIST_ID, {
    max_results: SOLUTION,
    expansions: ["author_id"],
    "tweet.fields": ["public_metrics"],
  });

  await Promise.all(
    tweets.data.data.map(async (tweet) => {
      await userClient.v2.like(CURRENT_USER_ID, tweet.id);

      const delaySeconds = getRandomArbitrary() * 1000;
      await delay(delaySeconds);
      if (
        !AVOID_LIST.has(tweet.author_id) &&
        tweet.public_metrics.retweet_count > 5
      ) {
        await userClient.v2.retweet(CURRENT_USER_ID, tweet.id);
        console.log(`Liked and retweeted tweet ${tweet.id}`);
      } else {
        console.log(`${tweet.author_id} retweet avoided`);
      }
      const delayMinute = MINUTE + delaySeconds * 2;

      await delay(delayMinute);
    })
  );
};
console.log("running the fun stuff 🤠");
setInterval(async () => {
  await funStuff();
  runTimes += 1;
  console.log(`Ran ${runTimes} times 🤠`);
}, INTERVAL);
