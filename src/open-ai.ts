import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function generateResponse(prompt: string) {

    const message = `I will give you a message. If the message is written in devnagri script, return as is. If it is any other language or script, translate it to hindi and return in devnagri script. The message is "${prompt}". Never return more than 140 characters.`;
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 1024,

        // prompt: data,
        messages: [
            { "role": "user", "content": message },
        ]
    });
    const reply = completion?.data?.choices?.[0]?.message?.content ?? '';
    return reply;
}