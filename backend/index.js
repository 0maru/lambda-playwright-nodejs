const playwright = require('playwright-aws-lambda');

exports.handler = async (event, context) => {
    let browser = null;

    try {
        browser = await playwright.launchChromium();
        const context = await browser.newContext();

        const page = await context.newPage();
        const url = event['queryStringParameters']['url']
        if (!url) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'URLを入力してください　'
                }),
            };

        }
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
                    ogImageTags.push(tag);
                }
            });

            // LD-JSON を取得
            var jsonld = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].innerText);

            const jsJson = document.querySelector()

            return {
                ogImage: ogImageTags
            };
        });

        const title = await page.title()
        console.log('Page title: ', title);
        return {
            statusCode: 200,
            body: JSON.stringify({
                title: title,
                ogImage: data
            }),
        };
    } catch (error) {
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
