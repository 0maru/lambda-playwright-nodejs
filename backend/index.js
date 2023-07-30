const playwright = require('playwright-aws-lambda');

exports.handler = async (event, context) => {
    let browser = null;

    try {
        browser = await playwright.launchChromium();
        const context = await browser.newContext();

        const page = await context.newPage();
        const url = event['queryStringParameters']['url']
        await page.goto(event.url || url);
        const data = await page.evaluate(() => {
            // metaタグを取得
            const ogImageTags = [];
            const metaElements = document.querySelectorAll('meta');
            metaElements.forEach((element) => {
                const tag = {};
                const attributes = element.attributes;

                for (const {name, value} of attributes) {
                    tag[name] = value;
                }

                if (tag.property === 'og:image') {
                    ogImageTags.push(tag.content);
                }
            });

            // JSON-LD を取得
            // 順番が保証されていないのでループ回して最終的に取れたものを使用する
            var description = 'none';
            var price = -0;
            var priceCurrency = '';
            const jsonLdList = document.querySelectorAll('script[type="application/ld+json"]');
            jsonLdList.forEach((e) => {
                const json = JSON.parse(e.innerHTML);
                if ('offers' in json) {
                    description = json.offers.description;
                    price = json.offers.price;
                    priceCurrency = json.offers.priceCurrency;
                }
            });
            return {
                ogImage: ogImageTags[0],
                description,
                price,
                priceCurrency,
            };
        });
        console.log(data)

        const title = await page.title()
        console.log('Page title: ', title);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({
                title: title,
                ...data,
            }),
        };
    } catch (error) {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({
                message: error
            }),
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
