import axios from "axios";
import cheerio from "cheerio";
import { URL } from "url";

export async function scrapeImages(url: string, selector: string): Promise<string[]> {
    try
    {
        const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        timeout: 10000,
        });

        const $ = cheerio.load(data);
        const images = new Set<string>();

        $(selector).each((_, el) =>
        {
            const src =
                $(el).attr("src") ||
                $(el).attr("data-src") ||
                $(el).attr("data-lazy");

            if (src)
                images.add(new URL(src, url).href);
            else
            {
                const srcset = $(el).attr("srcset");
                if (srcset) {
                const first = srcset.split(",")[0].split(" ")[0];
                images.add(new URL(first, url).href);
                }
            }
        });
        
        $("[style*='background-image']").each((_, el) =>
        {
            const style = $(el).attr("style");
            const match = style?.match(/url\(["']?(.*?)["']?\)/);
            if (match)
                images.add(new URL(match[1], url).href);
        });

        return Array.from(images);
    }
    catch (err: any)
    {
        console.error("Scraping error:", err.message);
        return [];
    }
}
