import { REST, Routes, SlashCommandBuilder } from "discord.js";
import "../config";

const commands = [
  new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hello"),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

async function main() {
  await rest.put(
    Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID!),
    { body: commands }
  );

  console.log("Commands registered");
}

main();
