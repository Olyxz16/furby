import { Client, GatewayIntentBits, Events, Collection, REST, Routes } from "discord.js";
import { MessageEvent } from "./events/message.event";
import { InteractionEvent } from "./events/interaction.event";
import { config } from "@/config/config";
import { commands, isSlashCommand } from "./commands/command.registry";

export async function startDiscord() {
    const client = new Client({
        intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        ],
    });

    client.commands = new Collection();
    const slashCommandsBody = [];

    for (const command of commands) {
        if (isSlashCommand(command)) {
            client.commands.set(command.command.name, command);
            slashCommandsBody.push(command.command.toJSON());
        }
    }

    const rest = new REST().setToken(config.DISCORD_TOKEN);

    try {
        console.log(`Started refreshing ${slashCommandsBody.length} application (/) commands.`);

        const route = config.DISCORD_GUILD_ID
            ? Routes.applicationGuildCommands(config.DISCORD_APPLICATION_ID, config.DISCORD_GUILD_ID)
            : Routes.applicationCommands(config.DISCORD_APPLICATION_ID);

        await rest.put(
            route,
            { body: slashCommandsBody },
        );

        console.log(`Successfully reloaded ${slashCommandsBody.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }

    client.once(Events.ClientReady, () => {
        console.log(`Logged in as ${client.user?.tag}`);
    });

    const messageEvent = new MessageEvent();
    const interactionEvent = new InteractionEvent();

    client.on(Events.MessageCreate, async (message) => {
        await messageEvent.handle(message);
    });

    client.on(Events.InteractionCreate, async (interaction) => {
        await interactionEvent.handle(interaction);
    });

    await client.login(config.DISCORD_TOKEN);
}
