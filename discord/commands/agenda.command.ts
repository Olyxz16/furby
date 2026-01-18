import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from '../types/index';
import { getAgendaFromDiscordId } from '@/user/user.service';
import { DiscordAccountNotLinkedError } from "@/agenda/agenda.error";

export const AgendaCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("getagenda")
    .setDescription("Get your weekly agenda"),

  execute: async (interaction) => {
    try {
      const userId = interaction.user.id;
      const agenda = await getAgendaFromDiscordId({ discordId: userId });
      interaction.reply({content: agenda.data.toString()});
    } catch(err: any) {
      if (err instanceof DiscordAccountNotLinkedError) {
        console.warn("User tried to get agenda without discord account linked");
        interaction.reply({content: "You must link your discord account to retrieve your agenda. Use /link to link it.", ephemeral: true});
      } else {
        console.error(err);
        interaction.reply({content: "Error while retrieving agenda", ephemeral: true});
      }
    }
  }
}
