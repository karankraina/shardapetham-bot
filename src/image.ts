import font2base64 from 'node-font2base64';
import nodeHtmlToImage from 'node-html-to-image';
import path from 'path';

const shardaFont = font2base64.encodeToDataUrlSync(path.resolve(__dirname, '../Sharada.ttf'));
const hindiFont = font2base64.encodeToDataUrlSync(path.resolve(__dirname, '../Devnagri.ttf'));


export async function generateImage(sharda:string, devnagri: string, id:string) {
    const filePath = path.resolve(__dirname, '../images', `${id}.png`);
    return nodeHtmlToImage({
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
};

