import { chromium } from "playwright";

const formatName = (name: string): string => {
    const low = name.trim().toLowerCase();
    return low.charAt(0).toUpperCase() + low.slice(1);
};

export async function scrapeImages(firstName: string, lastName: string): Promise<string[]> {
    const fName = formatName(firstName);
    const lName = formatName(lastName);
    const pageUrl = `https://men.wikifeet.com/${fName}_${lName}`;
    const picsUrl = "https://pics.wikifeet.com";

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0"
    });

    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    await page.waitForSelector("div[id^='pid_']", { timeout: 15000 });

    const ids = await page.$$eval("div[id^='pid_']", divs =>
        divs.map(d => d.id.replace("pid_", ""))
    );

    await browser.close();

    if (ids.length === 0) {
        throw new Error ("No pictures found");
    }

    const images = ids.map(id => `${picsUrl}/${fName}-${lName}-Feet-${id}.jpg`);
    const random = images[Math.floor(Math.random() * images.length)];

    return [random];
}
