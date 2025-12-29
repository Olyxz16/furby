import { scrapeImages } from "./wiki.repository";
import axios from "axios";
import cheerio from "cheerio";

export async function getImages(url: string, selector: string) {return scrapeImages(url, selector);
}

export async function getValidPids(param1: string, param2: string): Promise<string[]>
{
  const url = `https://men.wikifeet.com/${param1}_${param2}`;
  try
  {
    const { data } = await axios.get(url, {
                                            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
                                            timeout: 10000,
                                            }
                                    );
    const $ = cheerio.load(data);
    const pids: string[] = [];

    $("[id^='pid_']").each((_, el) =>
    {
        const id = $(el).attr("id");
        const match = id?.match(/pid_(\d+)/);
        if (match)
            pids.push(match[1]);
    }
    );

    return pids;
  }
  catch (err: any)
  {
    console.error("Erreur récupération pids :", err.message);
    return [];
  }
}
