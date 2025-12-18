import { SlashCommand } from "../command-Interface/slash-command.interface";
import { HelloSlashCommand } from "../slash-command/hello.slash-command";

export const slashCommands: SlashCommand[] = [
  new HelloSlashCommand(),
];
