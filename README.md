### WEB PROJECT ###

# Partie X :

# Partie X : 

# Partie X : Bot Discord

Bot Discord développé en TypeScript, structuré de manière modulaire afin de séparer clairement
la gestion du client Discord, des événements, des commandes et des tâches planifiées.

### `discord.module.ts`
    Fournit une instance unique du client Discord.

    Ce module :
    - centralise la configuration du client
    - évite la création de multiples instances
    - permet au reste de l’application d’accéder au client de manière contrôlée


## Gestion des événements

### `message.event.ts`
    Gère les messages texte classiques envoyés dans les salons.

### `interaction.event.ts`
    Gère les interactions Discord, principalement les slash commands.

## Système de commandes

### `command.registry.ts`
    Registre et centralise toutes les commandes du bot.

    Objectif :
    - faire le lien entre Discord et l’implémentation des commandes
    - servir de point unique de routing pour les interactions
    - faciliter l’ajout de nouvelles commandes

### Embeds

#### `hello.embed.ts`
    Contient uniquement la construction d’un embed Discord.

