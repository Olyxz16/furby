import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { getFeets } from "../../common/wiki/wiki.service";
import { SlashCommand } from '../types/index';

export const feetCommand: SlashCommand =
{
    command: new SlashCommandBuilder()
    .setName("feet")
    .setDescription("Provide random feet pictures")
    .addStringOption(option =>
      option.setName("firstname") // MINUSCULES UNIQUEMENT, PAS D'ESPACE
        .setDescription("First name")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("lastname") // MINUSCULES UNIQUEMENT, PAS D'ESPACE
        .setDescription("Last name")
        .setRequired(true)) as any,

    execute: async (interaction: ChatInputCommandInteraction<CacheType>) =>
    {
        try
        {
            const fname = interaction.options.getString("firstname", true);
            const lname = interaction.options.getString("lastname", true);

            await interaction.deferReply();

            const urlImg = await getFeets(fname, lname);
            await interaction.editReply({
                content: urlImg
            });

        }
        catch (error: any)
        {
            console.error(error);
            if (interaction.deferred)
                await interaction.editReply({ content: "Erreur lors de l'exécution" });
            else
                await interaction.reply({ content: "Erreur", ephemeral: true });
            
        }
    }
};