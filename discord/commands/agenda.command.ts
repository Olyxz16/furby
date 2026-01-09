import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from '../types/index';
import { getAgendaFromDiscordId } from '@/user/user.service';

export const AgendaCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("getagenda")
    .setDescription("Get your weekly agenda"),

  execute: async (interaction) => {
    try {
      const userId = interaction.user.id;
      const agenda = await getAgendaFromDiscordId({ discordId: userId });
      interaction.reply({content: agenda.data.toString()});
    } catch(error: any) {
      interaction.reply({content: "Error", ephemeral: true});
    }
  }
}
