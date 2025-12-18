( DEV notes ) 
How do the bot run:

main.ts -> exit if init errors
  |
  v
app.module.ts
  |
  v
discord/discord.module.ts
  |
  v
Discord connects
  |
  v
Read everymessages   ->  User triggers command
                                    |
                                    v
                                  command.ts
                                    |
                                    v
                                  repository.ts
                                    |
                                    v
                                  embed.ts
                                    |
                                    v
                                  Discord reply