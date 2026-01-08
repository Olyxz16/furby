// Purpose: say hello on Discord

// class with a run() function
// run() -> hello.embed.ts.run(username)

import { Message } from "discord.js";
import { MessageCommand } from "../types/index";
import { helloEmbed } from "../embeds/hello.embed";

export class HelloCommand implements MessageCommand {
  triggers = ["hello", "hi", "yo"];

  async run(message: Message): Promise<void> {
    const username =
      message.member?.displayName ?? message.author.username;

    const embed = helloEmbed(username);
    await message.reply({ embeds: [embed] });
  }
}
