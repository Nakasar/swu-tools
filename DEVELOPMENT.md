# Guide de Développement - SWU Tools

## Installation

```bash
npm install
```

## Configuration

1. Copiez `.env.example` vers `.env.local`
2. Configurez les variables d'environnement nécessaires

### MongoDB

Pour le développement local, vous pouvez utiliser Docker:

```bash
podman run -d -p 27017:27017 --name mongodb mongo:latest
```

Ou utilisez MongoDB Atlas pour une base de données cloud gratuite.

### Vercel Blob Storage

Pour uploader des photos en production, vous aurez besoin d'un token Vercel Blob.

## Démarrage

```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000

## Structure du Projet

### Pages Principales

- `/` - Page d'accueil
- `/timers` - Liste des timers
- `/timers/draft` - Timer de draft
- `/timers/clock` - Timer de ronde
- `/sets` - Liste des sets
- `/sets/:setCode` - Détails d'un set
- `/sets/:setCode/setlist` - Liste imprimable des cartes
- `/judges/tools` - Outils pour arbitres
- `/judges/tools/limited` - Créer un événement limité
- `/judges/tools/events/:eventId` - Gérer un événement

### API Routes

- `POST /api/judges/events` - Créer un événement
- `GET /api/judges/events/:eventId` - Récupérer un événement
- `POST /api/judges/events/:eventId/players` - Ajouter un joueur
- `POST /api/judges/events/:eventId/judges` - Ajouter un arbitre
- `POST /api/judges/events/:eventId/players/:playerId/photos` - Upload photo (pool/decklist)
- `POST /api/judges/events/:eventId/players/:playerId/deckchecks` - Ajouter un deck check

## Fonctionnalités Implémentées

✅ Homepage avec navigation
✅ Timer de draft avec alertes
✅ Timer de ronde avec contrôles
✅ Liste des sets
✅ Détails de set
✅ Formulaire de setlist imprimable
✅ Création d'événements judges
✅ Gestion des joueurs
✅ Upload de photos (pool, decklist)
✅ Ajout de deck checks
✅ Navigation responsive

## Fonctionnalités à Venir

- Intégration MeiliSearch pour la recherche de cartes
- Authentification avec Better-Auth
- Affichage des cartes dans les détails de sets
- Export des données d'événements
- Statistiques d'événements

## Technologies Utilisées

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Shadcn UI
- MongoDB
- Vercel Blob Storage
- Zod pour la validation

## Notes de Développement

### Server Components vs Client Components

Par défaut, utilisez les Server Components. Utilisez `'use client'` uniquement quand nécessaire (hooks, événements, état local).

### API Routes

Préférez les Server Actions aux API routes quand possible. Les API routes sont utilisées ici pour plus de flexibilité.

### Upload de Photos

Les photos sont stockées dans Vercel Blob Storage en production. Pour le développement, assurez-vous d'avoir configuré le token.

### Base de Données

La structure MongoDB est flexible. Les schémas Zod valident les données à l'entrée.
