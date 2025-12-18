// Purpose: initialize Discord client and route events

import { Client, GatewayIntentBits, Events } from "discord.js";
import { MessageEvent } from "./events/default.event";
import { SlashEvent } from "./events/slash.event";
import { config } from "../config/config";
import { registerSlashCommands } from "./commands/register-slash-commands";

export async function startDiscord() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  await registerSlashCommands();

  const messageEvent = new MessageEvent();
  const slashEvent = new SlashEvent();

  // Log output
  client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag}`);
  });

  // Message based commands
  client.on(Events.MessageCreate, async (message) => {
    await messageEvent.handle(message);
  });

  // Slash commands
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    await slashEvent.handle(interaction);
  });

  await client.login(config.DISCORD_TOKEN);
}
