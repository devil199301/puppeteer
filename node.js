const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false, 
        devtools: true
    });
    const page = await browser.newPage();

    page.on('console', msg => console.log(`console :: ${msg._text}`));

    // page.on('pageerror', error => {
    //   console.log(error);
    //  });

    // page.on('response', response => {
    //   console.log(response);
    // });

    // page.on('request', request => {
    //   console.log(request);
    // });
    page.on('dialog', async dialog => {
        console.log(dialog);
        await dialog.dismiss();
        await browser.close();
    });
    /**
     * 設定寬高
     */
    const viewport = {
        width: 1300,
        height: 800,
        // isMobile: true,
        // hasTouch: true,
    }
    // page.on('error', err => {
    //     console.log('error happen at the page: ', err);
    // });
    // page.on('pageerror', pageerr => {
    //     console.log('pageerror occurred: ', pageerr);
    // });

    /**
     * 設定網址
     */
    const web = [{
        "Id": "",
        "Name": "",
        "PortalUrl2": "", 
        "SiteExist": ""
    }];

    for (var i = 0; i < web.length; i++) {
        try {
            await page.goto(web[i]['PortalUrl2']);
            console.log(`${web[i]['Id']} : 開始`);
            await page.setViewport(viewport);

            //關閉iframe
            try {
                await page.click('.site-announcement span.closed');
                console.log(`關閉iframe`);
            } catch (err) {
            };

            // 關閉popup-news
            try {
                await page.click('span[ng-click="closeMarquee()"]');
                console.log(`關閉popup-news`);
            } catch (err) {
            };

            // 關閉popup-dialog
            try {
                await page.click('button.ui-dialog-titlebar-close');
                console.log(`關閉popup-dialog`);
            } catch (err) {
            };

            console.log(`5秒檢查`);
            await page.waitFor(5000);

            await page.goto(`${web[i]['PortalUrl2']}/Lobby/Live`);
            console.log(`10秒檢查`);
            await page.waitFor(10000);

            // await page.screenshot({
            //     path: `${web[i]['Id']}.png`,
            //     fullPage: true // 全畫面截圖
            // });
            console.log(`${web[i]['Id']} : 結束`);
        } catch (err) {
            console.log(`Error loading : ${web[i]['Id']}`);
        }
    }

    await browser.close();
    console.log(`---------全部結束---------`);
})();