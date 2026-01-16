import axios from 'axios';
import * as cheerio from 'cheerio';

const formatName = (name: string): string =>
{
    if (!name)
        return "";
    const low = name.trim().toLowerCase();
    return low.charAt(0).toUpperCase() + low.slice(1);
};

export async function scrapesImages(firstName: string, lastName: string): Promise<string[]>
{
    const fName = formatName(firstName);
    const lName = formatName(lastName);
    
    const baseUrl = "https://men.wikifeet.com";
    const picsUrl = "https://pics.wikifeet.com";
    const pageUrl = `${baseUrl}/${fName}_${lName}`;

    try
    {
        const { data } = await axios.get(pageUrl,
        {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
            },
            timeout: 10000,
        });

        const $ = cheerio.load(data);
        const validImages: string[] = [];
        
        $("div[id^='pid_']").each((_, el) => {
            const idAttr = $(el).attr("id");
            
            if (idAttr) {
                const pidNumber = idAttr.replace("pid_", "");
                const customUrl = `${picsUrl}/${fName}_${lName}-Feet-${pidNumber}.jpg`;
                validImages.push(customUrl);
            }
        });

        if (validImages.length === 0)
            throw new Error("Aucune image trouvée pour cette personne.");
        
        const randomIndex = Math.floor(Math.random() * validImages.length);
        return [validImages[randomIndex]];

    }
    catch (error: any)
    {
        if (axios.isAxiosError(error) && error.response?.status === 404)
            throw new Error(`Le profil de ${fName} ${lName} est introuvable.`);
        
        throw error;
    }
}