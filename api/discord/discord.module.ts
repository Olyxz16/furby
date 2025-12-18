// discord/commands/hello.command.ts
// Catch all the discords Events the adapted command

import { Client, GatewayIntentBits, Events } from "discord.js";
import { handleHelloCommand } from "./commands/hello.command";
import { config } from "../config/config";

export async function startDiscord() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.once("ready", () => {  // if bot is connected to discord it return a log status
    console.log(`Logged in as ${client.user?.tag}`);
    });

  client.on(Events.MessageCreate, async (message) => {
    // ignore bots (including itself)
    if (message.author.bot) return;

    if (message.content === "hello") {
      await handleHelloCommand(message);
    }
  });

  await client.login(config.DISCORD_TOKEN);
}
