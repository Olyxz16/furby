import { 
  Collection, 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  AutocompleteInteraction,
  Message
} from "discord.js";

declare module "discord.js" {
  export interface Client {
    // We map the command name (string) to the command object
    commands: Collection<string, SlashCommand>;
  }
}

export type Command = SlashCommand | MessageCommand;

// A simple alias using native types
export interface SlashCommand {
  command: SlashCommandBuilder; // Native builder
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>; // Native interaction
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export interface MessageCommand {
  triggers: string[];   // words that trigger the command
  run(message: Message): Promise<void>;     // name of the command to trigger
}
