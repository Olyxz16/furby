import { startDiscord } from "./discord/discord.module";

export async function startApp() {
  await startDiscord();
}