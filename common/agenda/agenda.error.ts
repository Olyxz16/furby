export class DiscordAccountNotLinkedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DiscordAccountNotLinkedError';
  }
}
