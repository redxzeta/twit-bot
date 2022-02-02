import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";

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
  });

  await Promise.all(
    tweets.data.data.map(async (tweet) => {
      await userClient.v2.like(CURRENT_USER_ID, tweet.id);
      const delaySeconds = getRandomArbitrary() * 1000;
      delay(delaySeconds);
      await userClient.v2.retweet(CURRENT_USER_ID, tweet.id);
      const delayMinute =
        getRandomArbitrary() % 2 === 0
          ? MINUTE + delaySeconds
          : MINUTE - delaySeconds;
      delay(delayMinute);
    })
  );
};
console.log("running the fun stuff");
setInterval(() => {
  funStuff();
  runTimes += 1;
  console.log(`Ran ${runTimes} times`);
}, INTERVAL);
