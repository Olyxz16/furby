// Purpose: react to Discord message events

import { Message } from "discord.js";
import { commands } from "../commands/command.registry";

export class MessageEvent {
  async handle(message: Message): Promise<void> {
    if (message.author.bot) return;

    const content = message.content.toLowerCase().trim();

    for (const command of commands) {
      if (command.triggers.includes(content)) {
        await command.run(message);
        return;
      }
    }
  }
}