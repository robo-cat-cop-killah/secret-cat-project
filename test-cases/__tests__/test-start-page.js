const puppeteer = require('puppeteer');
jest.setTimeout(process.env.ASMA_GLOBAL_TIMEOUT);

describe('(Start Page)',() =>
{
	
	let pages;
	let page;
	let browser;
	
	beforeAll(async() => {
		var retries = 10;
		var count = 0;
		do {
			try {
				browser = await puppeteer.connect({browserURL: "http://localhost:9222/json",timeout:1000});
	   			pages = await browser.pages();
	  			page = pages[0];
		  	} catch (Exception) {

		  	}
	  	} while (browser == undefined && count < retries);
	});

	test("Load Single Page",async() => {	
		try {
			await page.goto("https://www.apica.io");

		} catch (e) {
  			if (e instanceof puppeteer.errors.TimeoutError) {
    				throw new Error("Failed to load https://www.apica.io.");
			}
		}	
	});

	test("Load Second Page",async() => {	
		try {
			await page.goto("https://www.digitaljournal.com");

		} catch (e) {
  			if (e instanceof puppeteer.errors.TimeoutError) {
    				throw new Error("Failed to load https://www.digitaljournal.com");
			}
		}	
	});	
	
	afterAll(() => setTimeout(() => process.exit(), 1000))
		
});

