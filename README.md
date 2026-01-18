### WEB PROJECT ###

# Partie X :

# Partie X : 

---------------------------------------------------------------------------------------------------


# Partie X : Bot Discord

Bot Discord développé en TypeScript, structuré de manière modulaire afin de séparer clairement
la gestion du client Discord, des événements, des commandes et des tâches planifiées.

### `discord.module.ts`
    Fournit une instance unique du client Discord.

    Ce module :
    - centralise la configuration du client
    - évite la création de multiples instances
    - permet au reste de l’application d’accéder au client de manière contrôlée


## ---- Gestion des événements ---- 

### `message.event.ts`
    Gère les messages texte classiques envoyés dans les salons.

### `interaction.event.ts`
    Gère les interactions Discord, principalement les slash commands.

## ---- Système de commandes ---- 

### `command.registry.ts`
    Registre et centralise toutes les commandes du bot.

    Objectif :
    - faire le lien entre Discord et l’implémentation des commandes
    - servir de point unique de routing pour les interactions
    - faciliter l’ajout de nouvelles commandes

### ---- Embeds ---- 

#### `hello.embed.ts`
    Contient uniquement la construction d’un embed Discord.


---------------------------------------------------------------------------------------------------


# Partie X : Frontend

L’implémentation complète de l’authentification et de certaines interactions frontend–backend n’a pas pu être finalisée.
La structure du frontend, la navigation et les appels API ont néanmoins été mis en place afin de démontrer l’architecture prévue, mais puisque l'authetification ne marche pas le Frontend est inutilisable. 

## Architecture générale
    Le frontend est organisé autour de quatre type d'élément principaux :

    - **Pages** : vues principales de l’application
    - **Services** : communication avec l’API backend
    - **Composants UI** : éléments visuels réutilisables
    - **Routing** : gestion de la navigation côté client


## ---- Pages ---- 

### `HomePage.tsx`
    Page principale de l’application.

    Objectif :
    - point d’entrée de l’utilisateur après le chargement de l’application
    - déclenchement des appels API nécessaires à l’affichage des données

### `PlanningPage.tsx`
    Affiche le planning de l’utilisateur connecté.

### `LoginPage.tsx`
    Page d’authentification.


### `NotFoundPage.tsx`
    Page 404 affichée lorsque la route demandée n’existe pas.


## ---- Routing ---- 

### `App.tsx`
    Point central de la navigation de l’application.

    Objectif :
    - définit les routes publiques et privées
    - encapsule l’application dans le layout principal
    - délègue la gestion réelle de l’authentification au backend


## ---- Services API ---- 

### `api.ts`
    Point d’accès à l’API backend.

### `students.ts`
    Service dédié à la récupération des étudiants.

### `planning.ts`
    Service dédié à la récupération du planning utilisateur.

## Producted by
SAZOS Cédric - LARONDE Mathis - TARZI Naïm
