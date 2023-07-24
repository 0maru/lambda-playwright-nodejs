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

        const title = await page.title()
        console.log('Page title: ', title);
        return {
            statusCode: 200,
            body: JSON.stringify(title),
        };
    } catch (error) {
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
