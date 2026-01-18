# **Documentation Technique & Architecture \- Projet AAW**

Equipe : SAZOS Cédric - LARONDE Mathis - TARZI Naim

Ce document a pour but de détailler les choix techniques, l'architecture du monorepo, la stratégie de déploiement (GitOps/K8s) et l'implémentation des fonctionnalités.

## **Architecture Globale : Le Monorepo**

Le projet est architecturé sous forme de **Monorepo** géré par **NPM Workspaces**. Ce choix nous permet de partager du code, des types et de la logique métier entre les différents services (API et Bot Discord) sans duplication, tout en maintenant une séparation claire des responsabilités.

### **Structure des Workspaces**

* **common/** : Le cœur du backend. Ce paquet contient :  
  * **Entities & DTOs** : Les définitions de types TypeScript partagées.  
  * **Repositories** : L'accès direct à la base de données (PostgreSQL).  
  * **Services** : La logique métier pure (ex: AuthService, AgendaService).  
  * *Avantage* : Si nous changeons une règle métier, l'API et le Bot Discord sont mis à jour simultanément.  
* **api/** : Une couche de transport légère (HTTP/REST) qui expose les services de common.  
* **discord/** : Une interface utilisateur alternative via Discord qui consomme les mêmes services de common.  
* **frontend/** : L'interface web utilisateur.

## **Détail des Composants**

### **1\. Le Frontend (/frontend)**

* **Framework** : **Next.js** (App Router) pour bénéficier du SSR et d'une structure de routing moderne.  
* **Langage** : TypeScript strict.  
* **Styling** : CSS Modules et Tailwind (inféré via globals.css).  
* **Architecture** :  
  * src/services/ : Abstraction des appels API (pattern Adapter).  
  * src/components/ : Composants UI réutilisables (Card, DataTable, etc.).  
  * **Déploiement** : Configuration via open-next.config.ts pour une optimisation serverless si nécessaire, et pipeline GitHub Actions dédié (deploy-frontend.yml).

### **2\. Le Backend (/api)**

* **Framework** : Node.js avec un serveur HTTP custom (basé sur l'analyse de server.ts).  
* **Rôle** : Agit comme contrôleur. Il reçoit les requêtes HTTP, valide les entrées, appelle les services de common, et retourne les réponses formatées.  
* **Sécurité** : Middleware de session (session.middleware.ts) pour gérer l'authentification.

### **3\. Le Bot Discord (/discord)**

* **Librairie** : discord.js  
* **Features** :  
  * **Commandes Slash** : Architecture modulaire (command.registry.ts). Chaque commande (agenda, link, feur) est isolée.  
  * **Events** : Gestionnaire d'événements (interaction.event.ts, message.event.ts).  
  * **Cron Jobs** : Tâches planifiées (ex: cron.mardi.ts) pour envoyer des rappels automatiques.  
* **Intégration** : Utilise directement la BDD via common pour lier les comptes Discord aux utilisateurs de l'application (link.command.ts).

### **4\. La Librairie Commune (/common)**

* **Database** : PostgreSQL.  
* **Pattern** : Utilisation du **Repository Pattern** (user.repository.ts, agenda.repository.ts) pour abstraire les requêtes SQL.  
* **Migration** : Le schéma est défini dans schema.sql.

## **Infrastructure & DevOps**

L'infrastructure est un point fort du projet, utilisant une approche moderne **Cloud Native**.

### **Docker & Environnement Local**

Le développement local est orchestré par docker-compose.yml qui monte :

1. Une base de données **PostgreSQL**.  
2. L'API.  
3. Le Bot Discord.  
4. Le Frontend.

### **Kubernetes & GitOps (FluxCD)**

Le déploiement en production ne se fait pas via des scripts manuels ("ClickOps"), mais via une approche **GitOps** avec **FluxCD**.

* **Kustomize** : La configuration Kubernetes est gérée via Kustomize pour gérer les différences entre environnements (infra/overlays/dev vs infra/overlays/prod).  
  * *Base* : Définitions communes (Deployment, Service, Ingress).  
  * *Overlays* : Patchs spécifiques (namespace, replica count, secrets).  
* **FluxCD (infra/clusters/prod/flux-system)** :  
  * Flux surveille le dépôt Git.  
  * Dès qu'un changement est poussé sur la branche main (ou tag), Flux synchronise l'état du cluster K8s pour qu'il corresponde au code.  
* **Composants Infra** :  
  * **Cert-Manager** : Gestion automatique des certificats SSL (Let's Encrypt) via issuer-prod.yaml.  
  * **Ingress** : Routage du trafic HTTP vers l'API.

### **CI/CD (GitHub Actions)**

* **Publish** : Build et push des images Docker sur un registre.  
* **Deploy Frontend** : Déploiement spécifique du front (souvent découplé du cycle de vie K8s pour Next.js sur certaines plateformes comme Vercel, ou intégré via conteneur).

## **Fonctionnalités Implémentées**

### **Authentification & Sécurité**

* **Magic Link** : Pas de mot de passe stocké. Un lien de connexion est envoyé (simulé ou réel), géré par AuthService et MagicLinkRepository.  
* **Session** : Gestion de session sécurisée stockée en base.  
* **Account Linking** : Possibilité de lier son compte Discord à son profil étudiant via une commande sécurisée.

### **Gestion Pédagogique (Planning & Étudiants)**

* Visualisation du planning (PlanningPage.tsx).  
* Gestion des étudiants et de leurs données.  
* Intégration bidirectionnelle : Le planning est consultable sur le Web et sur Discord.

### **Interaction Discord**

* Commandes utilitaires et "fun" (feur, hello).  
* Rappels automatiques via Cron jobs.

## **Qualité Code & Tests**

* **Tests Unitaires** : Présents dans les dossiers services (ex: agenda.service.spec.ts, auth.service.spec.ts). Exécutés via Jest.  
* **Tests d'Intégration** : Dossier dédié tests/integration/ couvrant des scénarios complets :  
  * auth-flow.hurl : Test des endpoints HTTP.  
  * full-flow.test.ts : Simulation de parcours utilisateur complet.  
* **Typage** : TypeScript est utilisé partout avec des DTOs stricts (.dto.ts) pour valider les données entrant et sortant.
