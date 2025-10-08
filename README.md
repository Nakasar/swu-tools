# SWU Tools

A set of tools for Star Wars Unlimited trading card game.

## Technical stack

- NextJS : fullstack web app framework. Use as much as possible server components and server actions. Restrain from using API routes unless absolutely required.
- TailwindCSS : CSS library.
- ShadcnUI : UI Components library.
- Better-Auth : authentication (email OTP only).
- MongoDB : database.
- MeiliSearch : card index and search engine.
- Vercel AI SDK : AI integration.
- Zod : Schema and input validation.

## Features

- Homepage (/) : présente les outils.
- Timers (/timers) : liste les différents types de timers.
- Draft Timer (/timers/draft) : timer pour le draft.
- Timer (/timers/clock) : timer de ronde.
- Sets (/sets) : liste les sets existants.
- Détails d'un set (/sets/:setCode) : détails d'un set et liste des cartes du set.
- Set cardlist (/sets/:setCode/setlist) : formulaire pour imprimer la liste des cartes d'un set pour une decklist format scellé.
- Outils judges (/judges/tools) : Homepage des outils de judge.
- Judge tool scellé (/judges/tools/limited) : Gestionnaire de format limité pour judge.
  - Un arbitre peut créer un évènement (judges/tools/events/:eventId) (id est un ID nanoid uniquement lettres).
  - L'arbitre créateur peut ajouter d'autrs arbitres (par email).
  - Les arbitres peut ajouter une liste de joueurs.
  - Les arbitres peut pour chaque joueur :
    - Ajouter une photo du paquet de cartes ouverts (la photo est uploadée sur vercel blob storage et stockée).
    - Ajouter une photo de la decklist du joueur (la photo est uploadée sur vercel blob storage et stockée).
    - Ajouter des deckchecks (un joueur peut avoir plusieurs deckchecks). Un deckcheck contient une photo que l'arbitre peut prendre (uploadée sur vercel blob storage et stockée).
  - Les arbitres peuvent consulter la liste des joueurs et afficher les photos prises (paquet de carte, decklist, deckchecks...).