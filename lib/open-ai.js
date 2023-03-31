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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponse = void 0;
const openai_1 = require("openai");
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
function generateResponse(prompt) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const message = `I will give you a message. If the message is written in devnagri script, return as is. If it is any other language or script, translate it to hindi and return in devnagri script. The message is "${prompt}". Never return more than 140 characters.`;
        const completion = yield openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 1024,
            // prompt: data,
            messages: [
                { "role": "user", "content": message },
            ]
        });
        const reply = (_e = (_d = (_c = (_b = (_a = completion === null || completion === void 0 ? void 0 : completion.data) === null || _a === void 0 ? void 0 : _a.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) !== null && _e !== void 0 ? _e : '';
        return reply;
    });
}
exports.generateResponse = generateResponse;
//# sourceMappingURL=open-ai.js.map