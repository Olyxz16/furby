import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { getFeets } from "../../common/wiki/wiki.service";
import { SlashCommand } from '../types/index';

export const feetCommand: SlashCommand =
{
    command: new SlashCommandBuilder()
    .setName("feet")
    .setDescription("Provide random feet pictures")
    .addStringOption(option =>
        option.setName("firstname")
        .setDescription("First name")
        .setRequired(true))
    .addStringOption(option =>
        option.setName("lastname")
        .setDescription("Last name")
        .setRequired(true)) as any,

    execute: async (interaction: ChatInputCommandInteraction<CacheType>) =>
    {
        const fname = interaction.options.getString("firstname", true);
        const lname = interaction.options.getString("lastname", true);

        try
        {
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
                await interaction.editReply({ content: `Sorry bud couldn't find ${fname} ${lname}'s juicy feet` });
            else
                await interaction.reply({ content: "Huh-hoh something went wrong", ephemeral: true });
            
        }
    }
};