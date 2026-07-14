# Pokedeck-V3

Le site montre les 101 premiers pokémon, vous pouvez vous y connecter et créer un deck de 5 cartes.

## Structure

- `back/` — API REST Node.js (Express + Sequelize + MySQL/MariaDB)
- `front/` — client React (Create React App)

## Démarrage rapide

```bash
# Base de données locale (MariaDB sous Docker, port 3307)
cd back
docker compose up -d

# API (http://localhost:5000)
npm install
npm start

# Front (http://localhost:3000)
cd ../front
npm install
npm start
```

Copier les fichiers `.env.example` en `.env` dans `back/` et `front/` et adapter les valeurs.

## Déploiement (Infomaniak)

- `back/` : site Node.js (commande de build `npm install`, commande de démarrage `node index.js`), variables d'environnement pointant vers la base MariaDB Infomaniak.
- `front/` : `npm run build` puis upload du contenu de `build/` sur un site statique.
- Base : importer `back/app/data/import_table.sql` puis `back/app/data/import_data.sql`.
