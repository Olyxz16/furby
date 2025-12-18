// Purpose: register Discord slash (/) commands with the Discord API (guild scope)

import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { slashCommands } from "./command-registry/slash-command.registry";
import { config } from "../../config/config";

export async function registerSlashCommands() {
  const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);
  // Convert internal slash command definitions into Discord API object ( what ever the fuck it is called, I write exactly what I want )
  const body = slashCommands.map((cmd) =>
    new SlashCommandBuilder()
      .setName(cmd.name)
      .setDescription(cmd.description)
      .toJSON()
  );
  // Register commands for a specific guild (instant availability)
  await rest.put(
    Routes.applicationGuildCommands(
      config.DISCORD_APPLICATION_ID,
      config.DISCORD_GUILD_ID
    ),
    { body }
  );

  console.log("Slash commands registered (guild)");
}
