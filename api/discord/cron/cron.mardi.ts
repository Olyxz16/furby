import cron from "node-cron";
import { Client, TextChannel, ChannelType, PermissionsBitField } from "discord.js";
let sentGuilds = new Set<string>();

export function startMardiGIF(client: Client) {

  cron.schedule("0 8 * * 2", async () => {
    console.log("Tuesday gif on the way");

    client.guilds.cache.forEach(async (guild) =>
    {
      if (sentGuilds.has(guild.id)) return;

      const channels = guild.channels.cache.filter(
        (ch) =>
          ch.type === ChannelType.GuildText &&
          ch.name.toLowerCase() === "general" &&
          ch.permissionsFor(client.user!)?.has(PermissionsBitField.Flags.SendMessages)
      ) as Map<string, TextChannel>;

      if (channels.size === 0) return;
      
      channels.forEach(async (channel) =>
      {
        try
        {
          await channel.send(
          {
            files: [
              "https://tenor.com/bPxMt.gif"
            ]
          });
          console.log("Gif sent to ${guild.name} -> ${channel.name}");
        } catch (err)
        {
          console.error("Cant sent GIF to ${guild.name} -> ${channel.name}", err);
        }
      });
      sentGuilds.add(guild.id);
    });
  });

  cron.schedule("0 9 * * 2", () =>
  {
    console.log("Reset for next Tuesday");
    sentGuilds = new Set();
  });
}

