const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const viewport = {
        width: 1300,
        height: 900,
        // isMobile: true,
        // hasTouch: true,
    }
    page.on('error', err => {
        console.log('error happen at the page: ', err);
    });
    page.on('pageerror', pageerr => {
        console.log('pageerror occurred: ', pageerr);
    });

    const web = [{
            "Id": "BW005-02.Portal",
            "Name": "Run - 太阳城(原老虎机)  简易登入页面",
            "PortalUrl2": "http://www.lhj8855.com/",
            "SiteExist": true
        },
        {
            "Id": "BW006-01.Portal",
            "Name": "Run2 MG老虎机",
            "PortalUrl2": "http://www.smart17.com/",
            "SiteExist": true
        }
    ];

    for (var i = 0; i < web.length; i++) {
        try {
            await page.goto(web[i]['PortalUrl2']);
            //   await page.setViewport(viewport);
            await page.waitFor(1000);
            await page.screenshot({
                path: `${web[i]['Id']}.png`,
                fullPage: true
            });
            console.log(`${web[i]['Id']}:'success'`)
        } catch (err) {
            console.log(`Error loading page:${web[i]['Id']}`, err);
        }
    }

    await browser.close();
    // await page.goto('http://www.00220040.com/');
    // await page.click('#nav>ul>li.prmotion >a ')
    // await page.type('input#login_account', 'gpkcs')
    // await page.screenshot({
    //     path: `tefst.png`
    // });
})();