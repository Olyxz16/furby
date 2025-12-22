// Purpose: say hello on Discord

// class with a run() function
// run() -> hello.embed.ts.run(username)

import { Message } from "discord.js";
import { Command } from "./command.interface";
import { helloEmbed } from "../embeds/hello.embed";

export class HelloCommand implements Command {
  triggers = ["hello", "hi", "yo"];

  async run(message: Message): Promise<void> {
    const username =
      message.member?.displayName ?? message.author.username;

    const embed = helloEmbed(username);
    await message.reply({ embeds: [embed] });
  }
}