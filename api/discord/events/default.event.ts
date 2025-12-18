// Purpose: react to Discord message events

import { Message } from "discord.js";
import { commands } from "../commands/command-registry/default-command.registry";

export class MessageEvent {
  async handle(message: Message): Promise<void> {
    // Ignore messages sent by bots
    if (message.author.bot) {
      return;
    }

    // Normalize message in lowercase
    const content = message.content.toLowerCase().trim();

    // Find and execute the first matching command
    for (const command of commands) {
      if (command.triggers.includes(content)) {
        await command.run(message);
        return;
      }
    }
  }
}
