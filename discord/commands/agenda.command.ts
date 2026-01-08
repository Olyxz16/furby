import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from '../types/index';

export const AgendaCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("getagenda")
    .setDescription("Get your weekly agenda"),

  execute: async (interaction) => {
    interaction.reply({content: "agenda"});
  }
}
