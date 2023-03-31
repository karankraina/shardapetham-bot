require("dotenv").config();
const express = require('express');
const { generateImage } = require("./image");
const { generateResponse } = require("./openai");
const { devnagriToSharda } = require("./sharda");
const { setRules, startStream, replyToTweet, getTweetInfo, singleReply } = require("./twitter");
const { parser } = require("./utils");

const app = express();

app.listen(process.env.PORT || 80, () => {
    console.log('Server started!')
});


app.get('/image/:id', async (request, response) => {
    try {
        const {id} = request.params;
    const tweet = await getTweetInfo(id);
    const { text } = tweet?.data ?? {}; 

    const devnagri = await generateResponse(text);
    const sharda = devnagriToSharda(devnagri);

    await generateImage(sharda, devnagri);

    response.sendFile(__dirname + '/sharda.png');

    } catch (error) {
        console.log(error.message);
        response.status(500).send('error')
    }
    
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

        const repliedToId = tweet?.includes?.tweets?.[1]?.id ?? '';

        const url = `${process.env.host || 'https://shardapeetham-bot.onrender.com'}/image/${repliedToId}`;
        const message = `Hello,\nHere is your image URL: ${url}`;

        // const text = tweet.data.text.replace('#revivesharda', '').trim();

        // const generated = await generateResponse(text);
        // const response = devnagriToSharda(generated)
        // console.log({ response, responseLength: response.length, text, textLength: text.length });
        // const replies = parser(generated, response);
        // console.log({replies})
        
        // await replyToTweet(tweet.data.id, replies)

        await singleReply(tweet.data.id, message)
        
    })

}

// main()


