const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const web = require('./web');
const webList = web.webList;

(async () => {

    const browser = await puppeteer.launch({
        // headless: false,
        // devtools: true
    });

    const page = await browser.newPage();

    /**
     * 設定寬高
     */
    const viewport = {
        width: 1300,
        height: 800,
        // isMobile: true,
        // hasTouch: true,
    }

    page.on('console', msg => {
        if (msg._type === 'error') {
            console.log(`console :: ${msg._text}`)
        }
    });

    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.dismiss();
    });

    // page.on('pageerror', error => {
    //   console.log(error);
    //  });

    page.on('response', response => {
        if (response._status === 404) {
            console.log(`404 :: ${response._url}`);
        }
    });

    // page.on('request', request => {
    //   console.log(request);
    // });

    // page.on('error', err => {
    //     console.log('error happen at the page: ', err);
    // });

    // page.on('pageerror', pageerr => {
    //     console.log('pageerror occurred: ', pageerr);
    // });

    for (var i = 0; i < webList.length; i++) {
        try {
            await page.goto(webList[i]['PortalUrl2']);
            const html = await page.content();
            const $ = cheerio.load(html);
            const head = $('html').attr('ng-app');
            const icon = $('head link[rel="shortcut icon"]').attr('href');;
            const url = await page.evaluate(() => location.href);

            // 檢查是不是我們的網站
            if (!head) {
                console.log(`${webList[i]['Id']} : 不是我們的網站`);
                continue
            }

            // 檢查網站是否和ID一樣
            if (icon.search(webList[i]['Id']) === -1) {
                console.log(`${webList[i]['Id']} : 連結不對`);
                continue
            }

            if (url.search(`/Account/Login`) !== -1) {
                console.log(`${webList[i]['Id']} : 簡易登入頁 bye ~~ `);
                continue
            }

            await page.setViewport(viewport);

            console.log(`${webList[i]['Id']} : 開始`);

            //關閉iframe
            try {
                await page.click('.site-announcement span.closed');
                // console.log(`關閉iframe`);
            } catch (err) {};

            // 關閉popup-news
            try {
                await page.click('span[ng-click="closeMarquee()"]');
                // console.log(`關閉popup-news`);
            } catch (err) {};

            // 關閉popup-dialog
            try {
                await page.click('button.ui-dialog-titlebar-close');
                // console.log(`關閉popup-dialog`);
            } catch (err) {};

            // await page.waitFor(10000);

            await page.screenshot({
                path: `img/${webList[i]['Id']}-index.png`,
                fullPage: true // 全畫面截圖
            });

            // await page.goto(`${webList[i]['PortalUrl2']}/Lobby/Live`);
            // console.log(`進Live`);
            // await page.waitFor(10000);

            // await page.screenshot({
            //     path: `img/${webList[i]['Id']}-Live.png`,
            //     fullPage: true // 全畫面截圖
            // });

            // await page.goto(`${webList[i]['PortalUrl2']}/Register`);
            // console.log(`進Register`);
            // await page.waitFor(10000);

            // await page.screenshot({
            //     path: `img/${webList[i]['Id']}-Register.png`,
            //     fullPage: true // 全畫面截圖
            // });

            console.log(`${webList[i]['Id']} : 結束`);
        } catch (err) {
            console.log(`Error loading : ${webList[i]['Id']}`);
        }
    }

    await browser.close();
    console.log(`---------全部結束---------`);
})();