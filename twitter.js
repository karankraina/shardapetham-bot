const { TwitterApi, ETwitterStreamEvent } = require("twitter-api-v2");
const { promisify } = require('util');

const sleep = promisify(setTimeout);


const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
});


const bearer = new TwitterApi(process.env.BEARER_TOKEN);

const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;

let stream = null;

function getTweetInfo(id) {
    return twitterBearer.v2.singleTweet(id)
}

async function getClient() {
    if (stream) {
        return stream;
    }
    try {
        stream = await twitterBearer.v2.searchStream({
            'tweet.fields': ['referenced_tweets', 'author_id'],
            expansions: ['referenced_tweets.id'],
        });
        
        // Enable auto reconnect
        return stream;
    } catch (error) {
        console.log(error.message);
        await sleep(10000)
        stream = await getClient();
        return stream;
    }
   
}

async function closeConnection() {
    return stream?.close?.();
}
async function setRules() {

// Get and delete old rules if needed
const rules = await twitterBearer.v2.streamRules();
if (rules.data?.length) {
    await twitterBearer.v2.updateStreamRules({
        delete: { ids: rules.data.map(rule => rule.id) },
    });
}

// Add our rules
await twitterBearer.v2.updateStreamRules({
    add: [{ value: '@shardapeetham translate' }],
}).catch(() => console.log('Error in updating rules'));
console.log('RULES UPDATED');

    

}

async function replyToTweet(tweetId, replies) {
    
    let toReplyId = tweetId;

    for (let reply of replies) {
        const tweeted = await twitterClient.v2.tweet(reply, {
            reply: {
                in_reply_to_tweet_id: toReplyId,
            }
        });
        toReplyId = tweeted.data.id;

    }
    // Reply to tweet
    // await twitterClient.v1.reply('Thanks for your tweet !', tweet.data.id);
    console.log('replied to tweet')
}
async function singleReply(tweetId, reply) {
    
    const tweeted = await twitterClient.v2.tweet(reply, {
        reply: {
            in_reply_to_tweet_id: tweetId,
        }
    });
    // Reply to tweet
    // await twitterClient.v1.reply('Thanks for your tweet !', tweet.data.id);
    console.log('replied to tweet: ', tweeted);
}

async function startStream(fn) {
    const stream = await getClient();
    
    console.log('stream set')
   
    stream.on(ETwitterStreamEvent.Data, fn);
}

module.exports = {
    getClient,
    setRules,
    replyToTweet,
    startStream,
    getTweetInfo,
    singleReply,
    closeConnection
}