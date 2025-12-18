// Interface that create / commands

import { ChatInputCommandInteraction } from "discord.js";

export interface SlashCommand {
  name: string;             // name
  description: string;      // discord description
  run(interaction: ChatInputCommandInteraction): Promise<void>;     // OnRun method
}
