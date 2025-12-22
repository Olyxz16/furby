// Purpose: initialize Discord client and route events

import { Client, GatewayIntentBits, Events } from "discord.js";
import { MessageEvent } from "./events/message.event";
import { config } from "../config/config";

export async function startDiscord() {
    const client = new Client({
        intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        ],
    });

    client.once(Events.ClientReady, () => {
        console.log(`Logged in as ${client.user?.tag}`);
    });

    const messageEvent = new MessageEvent();

    client.on(Events.MessageCreate, async (message) => {
        await messageEvent.handle(message);
    });

    await client.login(config.DISCORD_TOKEN);
}