// Purpose: say hello on Discord

// class with a run() function
// run() -> hello.embed.ts.run(username)

import { Message } from "discord.js";
import { helloEmbed } from "../embeds/hello.embed";

export async function handleHelloCommand(message: Message) {
  const username = message.author.username;
  const embed = helloEmbed(username);

  await message.reply({ embeds: [embed] });
}
