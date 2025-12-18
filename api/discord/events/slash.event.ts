// Purpose: react to Discord / commands


import { ChatInputCommandInteraction } from "discord.js";
import { slashCommands } from "../commands/command-registry/slash-command.registry";

export class SlashEvent {
  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    // Find the slash command matching the interaction name
    const command = slashCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );
    if (!command) {
      return;
    }

    // Execute the command logic
    await command.run(interaction);
  }
}