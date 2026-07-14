# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Vue d'ensemble

Pokedeck : site affichant les 101 premiers Pokémon, avec inscription/connexion et création d'un deck de 5 cartes maximum. Monorepo :

- `back/` — API REST Express + Sequelize + MySQL/MariaDB
- `front/` — client React 18 (Create React App, MUI, axios)

Le code, les routes, les colonnes SQL et les messages d'erreur sont en français (`nom`, `attaque_spe`, `/Inscription`, `/Connexion`…) — conserver cette convention.

Cible de déploiement : **Infomaniak** — le back sur un « site Node.js » (l'app doit écouter sur `process.env.PORT`, ce qui est déjà le cas dans `index.js`), le front en statique (`npm run build`), la base sur MariaDB Infomaniak. Le projet a été migré de PostgreSQL vers MySQL/MariaDB pour cette raison — ne pas réintroduire de syntaxe Postgres.

## Commandes

### Base de données locale (Docker, depuis `back/`)
```
docker compose up -d        # MariaDB 10.11 sur le port hôte 3307 (3306 est pris par un MySQL local)
docker compose down -v && docker compose up -d   # réinitialiser et ré-importer les données
```
Le schéma (`app/data/import_table.sql`) et les données (`app/data/import_data.sql`) sont importés automatiquement au premier démarrage du volume. Identifiants locaux : base `pokedeck`, user `pokedeck`, mot de passe `pokedeck`.

### Backend (`back/`)
```
npm start          # node-dev index.js (redémarrage auto), port .env PORT ou 5000
```
Pas de tests ni de lint configurés côté back.

### Frontend (`front/`)
```
npm start          # react-scripts start avec --openssl-legacy-provider
npm run build      # build de production (à uploader sur Infomaniak)
npm test           # jest en mode watch via react-scripts
npm test -- --watchAll=false NomDuFichier   # lancer un seul fichier de test
```

## Configuration / pièges connus

- Back `.env` : `PORT`, `accessTokenSecret` (signature JWT), `DB_HOST`, `DB_PORT` (3307 en local Docker, 3306 chez Infomaniak), `DB_NAME`, `DB_USER`, `DB_PASSWORD`. La connexion (`app/config/database.js`) est entièrement pilotée par ces variables, dialecte `mysql` (driver `mysql2`).
- Front `.env` : `REACT_APP_BASE_URL` (URL du back).
- Incohérence de stockage du token côté front : `LoginRequest` écrit le token dans `sessionStorage`, mais l'intercepteur axios le lit depuis `localStorage`. L'`id` utilisateur est dans `localStorage`.
- Les scripts SQL sont en syntaxe MySQL/MariaDB (backticks, `AUTO_INCREMENT`, `DATETIME`).

## Architecture backend

Flux : `index.js` → `app/router.js` → `app/Controllers/*` → `app/Models/*` (Sequelize) → MariaDB.

- **Routes** : toutes déclarées dans `app/router.js`. Les routes protégées passent par le middleware `jwtVerify` (`app/Middleware/Middleware.js`) qui vérifie le Bearer token **et** que `user.userId` correspond au paramètre `:id` de la route (403 sinon).
- **Modèles** : un fichier par table + `app/Models/index.js` qui déclare toutes les associations `belongsToMany` (pokemon↔types via `pokemon_type`, deck↔pokemon via `deck_pokemon`) et exporte tous les modèles. Toujours importer les modèles depuis `../Models` (pas les fichiers individuels) pour bénéficier des associations. Timestamps Sequelize désactivés globalement (`define: {timestamps: false}`).
- **Schéma** : tables `user`, `pokemon`, `types`, `pokemon_type`, `deck` (1 deck par user via `user_id`), `deck_pokemon`. Un deck est limité à 5 pokémons (vérifié dans `deckController.addPokemonToDeck`).
- **Auth** : `usersController` — mots de passe hashés avec bcrypt, JWT signé avec `accessTokenSecret`.

## Architecture frontend

- **Routing et état** : tout dans `src/App.js` — `react-router-dom` v6, état global (`deck`, `isLogged`, `pokedex`…) porté par `App` et passé par props (pas de store global ni de Context).
- **Appels API** : centralisés dans `src/requests/index.js` — instance axios unique (`baseURL: REACT_APP_BASE_URL`) avec un intercepteur qui ajoute le header `Authorization: Bearer <token>`. Ajouter toute nouvelle requête API dans ce fichier.
- **Composants** : un dossier par page/feature sous `src/components/` (Pokemons, Deck, Connexion, Inscription, Profil, DetailsPokemon, DetailsType, TypesPokemon, NavBar, Footer). Formulaires avec `react-hook-form`, popups avec `sweetalert2`, UI avec MUI.
- **Couleurs des types** : mapping dans `src/constants/PokemonTypeColors.js`.
