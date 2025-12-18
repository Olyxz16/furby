import { ChatInputCommandInteraction } from "discord.js";
import { SlashCommand } from "../command-Interface/slash-command.interface";
import { helloEmbed } from "../../embeds/hello.embed";

export class HelloSlashCommand implements SlashCommand {
  name = "sayhello";
  description = "Say hello";

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.user.username;
    const embed = helloEmbed(username);

    await interaction.reply({ embeds: [embed] });
  }
}