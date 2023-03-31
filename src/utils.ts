export function parser(devnagri: string, sharda: string) {
    const shardaFullText = `Sharda: ${sharda}`;
    const devnagriFullText = `Devnagri: ${devnagri}`;

    const shardaArr = shardaFullText.trim().split(' ');
    const devnagriArr = devnagriFullText.trim().split(' ');

    const response = [];

    let shardaResp = '';

    shardaArr.forEach(word => {
        if (shardaResp.length > 230) {
            response.push(shardaResp);
            shardaResp = '';
        }

        shardaResp += ' ' + word;
    });

    if (shardaResp) {
        response.push(shardaResp);
    }

    let devnagriResp = '';

    devnagriArr.forEach(word => {
        if (devnagriResp.length > 230) {
            response.push(devnagriResp);
            devnagriResp = '';
        }

        devnagriResp += ' ' + word;
    });

    if (devnagriResp) {
        response.push(devnagriResp);
    }

    response.push('This is a bot generated tweet. cc- @karankraina')
    

    const finalResponse = response.map((message, index) => {
        return `${index+1}/${response.length}\n${message.trim()}${index === response.length - 1 ? '' : '\ncontd..'}`
    });
    console.log(finalResponse);
    return finalResponse;

}