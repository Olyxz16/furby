import { Message } from "discord.js";
import { Command } from "./command.interface";
export class GifCommand implements Command {
  triggers = ["quoi ?"];

 
  private gifs: string[] = [
    "https://tenor.com/nFQtOYNaams.gif",
    "https://tenor.com/bOzME.gif",
    "https://tenor.com/dasizbmzJih.gif",
    "https://tenor.com/bE1l6.gif",
    "https://tenor.com/b2fHc.gif"
  ];

  async run(message: Message): Promise<void> {
    const randomGif = this.gifs[Math.floor(Math.random() * this.gifs.length)];

    await message.reply({
      files: [randomGif]
    });
  }
}
