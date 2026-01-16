import {scrapesImages } from "./wiki.repository";


export async function getImages(url: string, selector: string)
{
    return scrapesImages(url, selector);
}

export async function getFeets(fname : string,lname:string) : Promise<string>
{
    try
    {
        const urls = await scrapesImages(fname, lname);
        if (urls.length == 0)
            throw "pue sa mère";
        return urls[Math.floor(Math.random() * urls.length)];
    }
    catch (err: any)
    {
        console.error("Error scraping images :", err.message);
        throw err;
    }
}
