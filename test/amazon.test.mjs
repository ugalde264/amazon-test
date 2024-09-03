import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('Amazon Tests', function() {
    this.timeout(10000); 

    let browser, page;

    before(async () => {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
    });

    after(async () => {
        await browser.close();
    });

    it('should navigate to AmazonBasics and verify the element by text', async () => {
        await page.goto('https://www.amazon.com.mx');
        await page.click('a[href="/stores/node/12273534011/?field-lbr_brands_browse-bin=Amazon+Basics&ref_=nav_cs_amazonbasics"]');
        await page.waitForSelector('#Header-uigx25zsn6 > div > div > div.Hero__hero__Oz7Jk > img'); 
        const element = await page.$('#Header-uigx25zsn6 > div > div > div.Hero__hero__Oz7Jk > img');
        expect(element).to.not.be.null;
    });

    it('should navigate to AmazonBasics and verify the element by CSS selector', async () => {
        await page.goto('https://www.amazon.com.mx');
        await page.click('#nav-xshop > a:nth-child(11)'); 
        await page.waitForSelector('#nav-xshop > a:nth-child(11)');
        const element = await page.$('#nav-xshop > a:nth-child(11)');
        expect(element).to.not.be.null;
    });

    it('should navigate to AmazonBasics and verify the element by XPath', async () => {
        await page.goto('https://www.amazon.com.mx');
        const [link] = await page.$x('//*[@id="nav-xshop"]/a[10]'); 
        await link.click();
        await page.waitForSelector('selector-de-tu-elemento'); 
        const element = await page.$('selector-de-tu-elemento');
        expect(element).to.not.be.null;
    });
});
