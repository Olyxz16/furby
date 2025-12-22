// Interface that 

import { Message } from "discord.js";

export interface Command {
  triggers: string[];   // words that trigger the command
  run(message: Message): Promise<void>;     // name of the command to trigger
}