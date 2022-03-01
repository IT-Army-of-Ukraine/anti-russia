import fs from 'fs';
import Promise from 'bluebird';
import Cheerio from 'cheerio';
import _ from 'lodash';

const ReadFile = Promise.promisify(fs.readFile);
const WriteFile = Promise.promisify(fs.writeFileSync);

(async () => {
    let russianWebsites = await ReadFile('russian_websites.txt', 'utf8').then(data => data.split("\n").map(dataItem => dataItem.split(',')[0].trim()));
    russianWebsites = _.uniq(russianWebsites);

    let indexFile = await ReadFile('index.html.template', 'utf8');
    indexFile = indexFile.replace('XXX', russianWebsites.length);

    const iframeList = russianWebsites.map(russianWebsiteUrl => {
        const $ = Cheerio.load(`<iframe width="5" height="5" src="${russianWebsiteUrl.replace('https://', '').replace('http://', '')}" />`);

        return $('body').html() + "\n";
    });
    indexFile = indexFile.replace('YYY', iframeList.join(" "));

    await WriteFile('index.html', indexFile, );
})();