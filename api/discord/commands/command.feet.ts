import { Message } from "discord.js";
import { getImages, getValidPids } from "../../wiki/wiki.service";

const BASE_URL = "https://men.wikifeet.com";
const DEFAULT_SELECTOR = "feet";

export async function handleCommand(commandName: string, args: string[], message: Message)
{
    try
    {
        switch (commandName)
        {
            case "feet":
                return feetCommand(args, message);
            default:
                return message.reply("Not a command");
        }
    }
    catch (err: any)
    {
        console.error("Error command :", err.message);
        message.reply("Error happened during execution of "+commandName);
    }
}

async function feetCommand(args: string[], message: Message)
{
    if (args.length != 2)
    {
        return message.reply("Exactly two argument needed");
    }

    const param1 = args[0];
    const param2 = args[1];

    let validPids: string[];
    try
    {
        validPids = await getValidPids(param1, param2);
    }
    catch (err: any)
    {
        console.error("Error fecthing pids :", err.message);
        return message.reply("Impossible to fecth valid ids for those parameters");
    }

    if (!validPids.length)
        return message.reply(`${param1} ${param2} isn't referenced`);
    
    const pid = validPids[Math.floor(Math.random() * validPids.length)];
    const url = `https://pics.wikifeet.com/${param1}-${param2}-Feet-8385300.jpg`;
    console.log("Scraping URL :", url);

    let images: string[];
    try
    {
        images = await getImages(url, DEFAULT_SELECTOR);
    }
    catch (err: any)
    {
        console.error("Error scraping images :", err.message);
        return message.reply("Impossible to fetch img from this url");
    }

    if (!images.length)
        return message.reply("No image found");
    const randomImage = images[Math.floor(Math.random() * images.length)];
    message.reply(randomImage);
}
