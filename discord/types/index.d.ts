import { 
  Collection, 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  AutocompleteInteraction,
  Message
} from "discord.js";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, SlashCommand>;
  }
}

export type Command = SlashCommand | MessageCommand;

export interface SlashCommand {
  command: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export interface MessageCommand {
  triggers: string[];
  run(message: Message): Promise<void>;
}
