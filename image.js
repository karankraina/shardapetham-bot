const font2base64 = require('node-font2base64')
const nodeHtmlToImage = require('node-html-to-image')


const shardaFont = font2base64.encodeToDataUrlSync(__dirname + '/Sharada.ttf')
const hindiFont = font2base64.encodeToDataUrlSync(__dirname + '/Devnagri.ttf')


async function generateImage(sharda, devnagri, id) {
    
    return nodeHtmlToImage({
        output: `./${id}.png`,
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
    .then(() => console.log('The image was created successfully!'))
};

module.exports = {
    generateImage,
}