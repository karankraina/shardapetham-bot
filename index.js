require("dotenv").config();
const { generateResponse } = require("./openai");
const { devnagriToSharda } = require("./sharda");
const { setRules, startStream, replyToTweet } = require("./twitter");
const { parser } = require("./utils");

async function main() {

    await setRules();

    await startStream(async tweet => {
        // Ignore RTs or self-sent tweets
        console.log("Tweet Received : ", tweet.data);
        const isARt = tweet.data.referenced_tweets?.some(tweet => tweet.type === 'retweeted') ?? false;
        if (isARt || tweet.data.author_id === '802409206615683072') {
            return;
        }

        const text = tweet.data.text.replace('#revivesharda', '').trim();

        const generated = await generateResponse(text);
        const response = devnagriToSharda(generated)
        console.log({ response, responseLength: response.length, text, textLength: text.length });
        const replies = parser(generated, response);
        console.log({replies})
        // await tweet(tweet.data.id, 'Thanks for your tweet !');
        // const tweeted = await twitterClient.v2.tweet(finalResponse, {
        //     reply: {
        //         in_reply_to_tweet_id: tweet.data.id,
        //     }
        // })
        await replyToTweet(tweet.data.id, replies)
        // Reply to tweet
        // await twitterClient.v1.reply('Thanks for your tweet !', tweet.data.id);
    })

}

main()


