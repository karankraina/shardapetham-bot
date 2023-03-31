import { TwitterApi, ETwitterStreamEvent, TweetV2SingleResult } from 'twitter-api-v2';
import { promisify } from 'util';
import { generateResponse } from './open-ai';
import { devnagriToSharda } from './sharda';
import { generateImage } from './image';

const sleep = promisify(setTimeout);

const {
    API_KEY: appKey = '',
    API_SECRET: appSecret = '',
    ACCESS_TOKEN: accessToken = '',
    ACCESS_SECRET: accessSecret = '',
    BEARER_TOKEN: bearerToken = '',
} = process.env;


async function startStreaming() {

    const client = new TwitterApi({
        appKey,
        appSecret,
        accessToken,
        accessSecret,
    });

    const bearer = new TwitterApi(bearerToken);

    const twitterClient = client.readWrite;
    const twitterBearer = bearer.readOnly;

    // Get and delete old rules if needed
    const rules = await twitterBearer.v2.streamRules();
    if (rules.data?.length) {
        await twitterBearer.v2.updateStreamRules({
            delete: { ids: rules.data.map(rule => rule.id) },
        });
    }

    // Add our rules
    await twitterBearer.v2.updateStreamRules({
        add: [{ value: '#shardapeetham translate' }],
    });

    const stream = await twitterBearer.v2.searchStream({
        'tweet.fields': ['referenced_tweets', 'author_id'],
        expansions: ['referenced_tweets.id'],
    });

    stream.on(ETwitterStreamEvent.Data, async (tweet) => {
        try {
            const isARt = tweet.data.referenced_tweets?.some(tweet => tweet.type === 'retweeted') ?? false;
            if (isARt || tweet.data.author_id === '802409206615683072') {
                return;
            }

            const repliedToId = tweet?.includes?.tweets?.[1]?.id ?? '';
            const imageUrl = `${process.env.host || 'https://shardapeetham-bot.onrender.com'}/image/${repliedToId}`;
            const message = `Hello,\nHere is your image URL: ${imageUrl}`;

           startImageGeneration(tweet);

            await twitterClient.v2.tweet(message, {
                reply: {
                    in_reply_to_tweet_id: tweet.data.id,
                }
            });
            // Reply to tweet
            // await twitterClient.v1.reply('Thanks for your tweet !', tweet.data.id);
            console.log('replied to tweet: ');
        } catch (error: any) {
                console.error('Error while handling tweet : ', error?.message);
        }

       
    });

}

async function startImageGeneration(tweet: TweetV2SingleResult) {
    try {
        const tweetText = (tweet?.includes?.tweets?.[1]?.text ?? '').replace('@shardapeetham', '').replace('#translate', '').trim();
        const responseFromOpenAIInHindi = await generateResponse(tweetText);
        const shardaTransliteration = devnagriToSharda(responseFromOpenAIInHindi);

        await generateImage(shardaTransliteration, responseFromOpenAIInHindi, tweet.data.id);
        
    } catch (error) {
        console.log('Error in image generation - ', error)
    }
}

async function main() {
    try {
        await startStreaming().then(() => {
            console.log('Streamer Running ...!');
        }).catch((error) => {
            console.log('Error during streaming set up: ', error.message);
            sleep(5 * 1000).then(() => {
                console.log('Retrying connection');
                main();
            })
        })
    } catch (error) {
        
    }
}

main();