import {scrapeImages } from "./wiki.repository";


export async function getImages(url: string, selector: string)
{
    return scrapeImages(url, selector);
}

export async function getFeets(fname : string,lname:string) : Promise<string>
{
    try
    {
        const urls = await scrapeImages(fname, lname);
        if (urls.length == 0)
            throw new Error ("No pictures found");
        return urls[Math.floor(Math.random() * urls.length)];
    }
    catch (err: any)
    {
        console.error("Error scraping images :", err.message);
        throw err;
    }
}
