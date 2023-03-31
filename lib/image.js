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
exports.generateImage = void 0;
const node_font2base64_1 = __importDefault(require("node-font2base64"));
const node_html_to_image_1 = __importDefault(require("node-html-to-image"));
const path_1 = __importDefault(require("path"));
const shardaFont = node_font2base64_1.default.encodeToDataUrlSync(path_1.default.resolve(__dirname, '../Sharada.ttf'));
const hindiFont = node_font2base64_1.default.encodeToDataUrlSync(path_1.default.resolve(__dirname, '../Devnagri.ttf'));
function generateImage(sharda, devnagri, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.resolve(__dirname, '../images', `${id}.png`);
        return (0, node_html_to_image_1.default)({
            output: filePath,
            html: `<html>

        <head>
            <style>
                @font-face {
                    font-family: 'sharda';
                    src: url(${shardaFont}) format('woff2');
                }
                @font-face {
                    font-family: 'devnagri';
                    src: url(${hindiFont}) format('woff2');
                }
        
                .sharda {
                    font-family: 'sharda';
                    color: #f65419;
                }
                .devnagri {
                    font-family: 'devnagri';
                }
                * {
                    font-size: 1.2rem
                }
            </style>
        </head>
        
        <body>
            <div style="display:flex;flex-direction: column; justify-content: center; align-items: center; height:100%; padding: 10%; ">
                <div class="sharda">
                    <h1 style="text-align: center">Sharda Script</h1>
                    <h2> ${sharda}</h2>
                </div>
                <div class="devnagri">
                    <h1 style="text-align: center">Devnagri Script</h1>
                    <p> ${devnagri}</p>
                </div>
            </div>
        </body>
        
        </html>`
        })
            .then(() => console.log('The image was created successfully! ' + id));
    });
}
exports.generateImage = generateImage;
;
//# sourceMappingURL=image.js.map