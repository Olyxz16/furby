import { Message } from "discord.js";
import { commands, isMessageCommand } from "../commands/command.registry";

export class MessageEvent {
  async handle(message: Message): Promise<void> {
    if (message.author.bot) return;

    const content = message.content.toLowerCase().trim();

    for (const command of commands) {
      if (isMessageCommand(command) && command.triggers.includes(content)) {
        await command.run(message);
        return;
      }
    }
  }
}
