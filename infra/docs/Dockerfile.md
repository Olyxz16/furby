# Explication structure Dockerfile

Le but des Dockerfile est de créer les images des conteneurs qui seront utilisées par kubernetes pour faire tourner l'application.

Elles ont 3 buts principaux :
- être réplicables
- être les plus légères possibles pour éviter de trop consommer en ressources et pour être déployées rapidement
- apparaître dans le repo pour faciliter la gestion

## Concepts généraux

Pour favoriser la réplicabilité, on veut sélectionner une image de base stable, d'une version connue pour fonctionner avec notre application.

Pour limiter la taille de l'image finale, on veut aussi sélectionner une image de base légère.

Comme on utilise node 22, l'image [node:22-alpine](https://hub.docker.com/_/node/) est appropriée : bonne version, et base alpine linux ~5Mo.

Pour la sécurité, on veut aussi utiliser un user non-sudoer. L'image node fourni l'utilisateur node:node à cet effet.

## Spécificité du projet

Comme le but est de créer des images limitées à l'application que l'on souhaite faire tourner, et de par la nature monolithique du projet, les deux parties de l'application sont jointes par le workspace common. Cela modifie très légèrement la manière de gérer les dépendances, même si le gros du travail est effectué pendant l'étape de build par esbuild.

## Example détaillé

Prenons le Dockerfile de l'api et détaillons le :

``` Dockerfile
# Création d'une layer appelée "base", qui servira de base aux autres couches intermédiaires
FROM node:22-alpine AS base
# On se place dans le dossier /app pour le reste des opérations
WORKDIR /app

# On copie les fichiers package*.json du root, dans /app/
COPY package.json package-lock.json ./
# On copie les dossiers sources api/ et common/
COPY api/ ./api/
COPY common/ ./common/

# On crée une nouvelle layer "build", à partir de base
# Tous les fichiers précédemment copiés dans base sont également présents ici.
# L'étape de build est explicite mais sa présence n'est pas trivial : ayant besoin des dépendances de dev, elle a besoin d'une layer à part.
FROM base AS builder

# Installe toutes les dépendances (même dépendances dev)
RUN npm install --workspace=api
# Build le projet
RUN npm run build:api

# On crée une nouvelle layer "installer", à partir de base.
# Pareil que la layer build, les fichiers de "base" sont présents.
# Cette étape est la pour installer les modules de prod (donc tout ce qui n'est pas dépendances dev)
FROM base AS installer
WORKDIR /app

# Installation de tous les modules non dev
RUN npm install --workspace=api --omit=dev

# Image finale, héritant de node:22-alpine et non "base" pour éviter d'avoir les dossiers sources dans l'image finale.
FROM node:22-alpine AS runner
# Ajout de labels, ici pour indiquer que cette image appartient au repo github du projet. Cela permettra de dire a Github d'afficher l'image dans la section package du repo.
LABEL org.opencontainers.image.source=https://github.com/Olyxz16/furby
WORKDIR /app

# Copie du répertoire node_modules
COPY --from=installer --chown=node:node /app/node_modules node_modules
# Copie du bundle js
COPY --from=builder --chown=node:node /app/api/dist/api.js index.js

# Selection de l'utilisateur node, non-sudoer
USER node:node

# Déclaration du point d'entrée de l'application, ce qui sera exécuté au démarrage de l'image.
ENTRYPOINT [ "node", "index" ]
```
