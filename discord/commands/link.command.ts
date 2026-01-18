import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "types";
import { ConsumeMagicLink } from "../../common/auth/auth.service";

export const AgendaCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("getagenda")
    .setDescription("Get your weekly agenda")
    .addStringOption(option => 
      option.setName("magic-link")
      .setDescription("The discord magic link")
      .setRequired(true)) as any,

  execute: async (interaction) => {
    try {
      const userId = interaction.user.id;
      const magicLink = interaction.options.getString("magic-link", true);
      await ConsumeMagicLink({
        magicLinkCode: magicLink,
        discordUserId: userId 
      });
      interaction.reply({content: "Account linked successfully", ephemeral: true});
    } catch(err: any) {
        console.error(err);
        interaction.reply({content: "Error while linking account", ephemeral: true});
    }
  }
}
