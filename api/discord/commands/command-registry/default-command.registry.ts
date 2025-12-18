// rList of all the bot commands
import { Command } from "../command-Interface/default-command.interface";
import { HelloCommand } from "../default-command/hello.default-command";

export const commands: Command[] = [
  new HelloCommand(),
];