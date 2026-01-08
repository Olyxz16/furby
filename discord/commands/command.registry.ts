// rList of all the bot commands
import { Command } from "./command.interface";
import { HelloCommand } from "./hello.command";

export const commands: Command[] = [
  new HelloCommand(),
];