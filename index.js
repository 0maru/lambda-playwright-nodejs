const playwright = require('playwright-aws-lambda');

exports.handler = async (event, context) => {
    let browser = null;

    try {
        browser = await playwright.launchChromium();
        const context = await browser.newContext();

        const page = await context.newPage();
        await page.goto(event.url || 'https://zozo.jp/?c=gr&did=99340280');

        const title = await page.title()
        console.log('Page title: ', title);
        const response = {
            statusCode: 200,
            body: JSON.stringify(title),
        };
        return response;
    } catch (error) {
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
