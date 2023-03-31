"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twitter_api_v2_1 = require("twitter-api-v2");
const util_1 = require("util");
const dotenv_1 = __importDefault(require("dotenv"));
const open_ai_1 = require("./open-ai");
const sharda_1 = require("./sharda");
const image_1 = require("./image");
dotenv_1.default.config();
const sleep = (0, util_1.promisify)(setTimeout);
const { API_KEY: appKey = '', API_SECRET: appSecret = '', ACCESS_TOKEN: accessToken = '', ACCESS_SECRET: accessSecret = '', BEARER_TOKEN: bearerToken = '', } = process.env;
function startStreaming() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const client = new twitter_api_v2_1.TwitterApi({
            appKey,
            appSecret,
            accessToken,
            accessSecret,
        });
        const bearer = new twitter_api_v2_1.TwitterApi(bearerToken);
        const twitterClient = client.readWrite;
        const twitterBearer = bearer.readOnly;
        // Get and delete old rules if needed
        const rules = yield twitterBearer.v2.streamRules();
        if ((_a = rules.data) === null || _a === void 0 ? void 0 : _a.length) {
            yield twitterBearer.v2.updateStreamRules({
                delete: { ids: rules.data.map(rule => rule.id) },
            });
        }
        // Add our rules
        yield twitterBearer.v2.updateStreamRules({
            add: [{ value: '#shardapeetham translate' }],
        });
        const stream = yield twitterBearer.v2.searchStream({
            'tweet.fields': ['referenced_tweets', 'author_id'],
            expansions: ['referenced_tweets.id'],
        });
        stream.on(twitter_api_v2_1.ETwitterStreamEvent.Data, (tweet) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c, _d, _e, _f, _g;
            try {
                const isARt = (_c = (_b = tweet.data.referenced_tweets) === null || _b === void 0 ? void 0 : _b.some(tweet => tweet.type === 'retweeted')) !== null && _c !== void 0 ? _c : false;
                if (isARt || tweet.data.author_id === '802409206615683072') {
                    return;
                }
                const repliedToId = (_g = (_f = (_e = (_d = tweet === null || tweet === void 0 ? void 0 : tweet.includes) === null || _d === void 0 ? void 0 : _d.tweets) === null || _e === void 0 ? void 0 : _e[1]) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : '';
                const imageUrl = `${process.env.host || 'https://shardapeetham-bot.onrender.com'}/image/${repliedToId}`;
                const message = `Hello,\nHere is your image URL: ${imageUrl}`;
                startImageGeneration(tweet);
                yield twitterClient.v2.tweet(message, {
                    reply: {
                        in_reply_to_tweet_id: tweet.data.id,
                    }
                });
                // Reply to tweet
                // await twitterClient.v1.reply('Thanks for your tweet !', tweet.data.id);
                console.log('replied to tweet: ');
            }
            catch (error) {
                console.error('Error while handling tweet : ', error === null || error === void 0 ? void 0 : error.message);
            }
        }));
    });
}
function startImageGeneration(tweet) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tweetText = ((_d = (_c = (_b = (_a = tweet === null || tweet === void 0 ? void 0 : tweet.includes) === null || _a === void 0 ? void 0 : _a.tweets) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.text) !== null && _d !== void 0 ? _d : '').replace('@shardapeetham', '').replace('#translate', '').trim();
            const responseFromOpenAIInHindi = yield (0, open_ai_1.generateResponse)(tweetText);
            const shardaTransliteration = (0, sharda_1.devnagriToSharda)(responseFromOpenAIInHindi);
            yield (0, image_1.generateImage)(shardaTransliteration, responseFromOpenAIInHindi, tweet.data.id);
        }
        catch (error) {
            console.log('Error in image generation - ', error);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield startStreaming().then(() => {
                console.log('Streamer Running ...!');
            }).catch((error) => {
                console.log('Error during streaming set up: ', error.message);
                sleep(5 * 1000).then(() => {
                    console.log('Retrying connection');
                    main();
                });
            });
        }
        catch (error) {
        }
    });
}
main();
//# sourceMappingURL=twitter.js.map