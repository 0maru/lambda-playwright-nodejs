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

        // metaタグを取得
        const ogImageTags = await page.evaluate(() => {
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

            return ogImageTags;
        });

        // 取得したmetaタグを表示
        console.log(ogImageTags);


        const title = await page.title()
        console.log('Page title: ', title);
        return {
            statusCode: 200,
            body: JSON.stringify({
                title: title,
                ogImage: ogImageTags[0]['content']
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
