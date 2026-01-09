import "dotenv/config";
import { startDiscord } from "./discord.module";

export async function main() {
  await startDiscord();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
