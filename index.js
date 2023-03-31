require("dotenv").config();
const http = require('http');
const { generateResponse } = require("./openai");
const { devnagriToSharda } = require("./sharda");
const { setRules, startStream, replyToTweet } = require("./twitter");
const { parser } = require("./utils");

// start a server for server
const server = http.createServer((request, response) => {
    response.end('Welcome to Shardapeetham Twitter Bot!');
});

server.listen(process.env.PORT || 80, () => {
    console.log('Server running')
})

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
        
        await replyToTweet(tweet.data.id, replies)
        
    })

}

main()


