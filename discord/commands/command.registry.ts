import { Command, MessageCommand, SlashCommand } from "../types/index";
import { HelloCommand } from "./hello.command";
import { GifCommand } from "./feur.command";
import { AgendaCommand } from "./agenda.command";
import { feetCommand } from "./wiki.command";

export const commands: Command[] = [
  new HelloCommand(),
  new GifCommand(),
  AgendaCommand,
  feetCommand
];

export function isMessageCommand(cmd: Command): cmd is MessageCommand {
  return (cmd as MessageCommand).triggers !== undefined;
}

export function isSlashCommand(cmd: Command): cmd is SlashCommand {
  return (cmd as SlashCommand).command !== undefined;
}
