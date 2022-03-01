import fs from 'fs';
import Promise from 'bluebird';
import Cheerio from 'cheerio';

const ReadFile = Promise.promisify(fs.readFile);
const WriteFile = Promise.promisify(fs.writeFileSync);

(async () => {
    const russianWebsites = await ReadFile('russian_websites.txt', 'utf8').then(data => data.split("\n").map(dataItem => dataItem.trim()));

    let indexFile = await ReadFile('index.html.template', 'utf8');
    indexFile = indexFile.replace('XXX', russianWebsites.length);

    const iframeList = russianWebsites.map(russianWebsiteUrl => Cheerio.load(`<iframe width="5" height="5" src="${russianWebsiteUrl}" />`).html());
    indexFile = indexFile.replace('YYY', iframeList.join(" ").repeat(10));

    await WriteFile('index.html', indexFile);
})();