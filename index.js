import {
  AVOID_LIST,
  TWITTER_LIST_ID,
  userClient,
  CURRENT_USER_ID,
  INTERVAL,
  SOLUTION,
} from "./config.js";

const MIN = 10;

const MAX = 39;

const MINUTE = 30000;

const RETWEET_COUNT = 11;

let runTimes = 0;

const getRandomArbitrary = (minNum = MIN, maxNum = MAX) =>
  Math.floor(Math.random() * (maxNum - minNum) + minNum);

const funStuff = async () => {
  const tweets = await userClient.v2.listTweets(TWITTER_LIST_ID, {
    max_results: SOLUTION,
    expansions: ["author_id"],
    "tweet.fields": ["public_metrics"],
  });

  await Promise.all(
    tweets.data.data.map(async (tweet, index) => {
      const coolDown = getRandomArbitrary() * 1000 * index;
      await delayedFetch(() => tweetLike(tweet.id), MINUTE + coolDown);

      await delayedFetch(
        () =>
          tweetRetweet(
            tweet.author_id,
            tweet.id,
            tweet.public_metrics.retweet_count
          ),
        MINUTE + coolDown + coolDown
      );
    })
  );
};
console.log("running the fun stuff 🤠");

const tweetLike = async (id) => {
  console.log(`Liked Tweet ${id}`);
  await userClient.v2.like(CURRENT_USER_ID, id);
};
const tweetRetweet = async (author_id, id, count) => {
  const randomNum = getRandomArbitrary(0, 5);
  const userRetweetCount =
    randomNum % 2 === 0 ? randomNum + RETWEET_COUNT : randomNum - RETWEET_COUNT;

  console.log(`userCount: ${count} randomNum: ${randomNum} `);
  if (!AVOID_LIST.has(author_id) && count > userRetweetCount) {
    await userClient.v2.retweet(CURRENT_USER_ID, id);
    console.log(`Retweeted tweet ${id}`);
  } else {
    console.log(`${author_id} retweet avoided`);
  }
};
function delayedFetch(tweetAction, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(tweetAction());
    }, delay);
  });
}

setInterval(async () => {
  await funStuff();
  runTimes += 1;
  console.log(`Ran ${runTimes} times 🤠`);
}, INTERVAL);
