import { EmbedBuilder } from "discord.js";

export function helloEmbed(username: string) {
  return new EmbedBuilder()
    .setTitle("Hello")
    .setDescription(`Hello **${username}**`)
    .setColor(0x00ff99);
}