# pressing-mobile-backend

Backend REST API pour **pressing-mobile** (Express.js + MongoDB Atlas + JWT).

## Stack
- Node.js >= 18
- Express 4
- Mongoose 8 (MongoDB Atlas)
- JWT (jsonwebtoken)
- bcryptjs

## Routes

| Methode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | /api/auth/login | - | Connexion, retourne JWT |
| POST | /api/auth/logout | Bearer | Revoque le token |
| GET | /api/auth/me | Bearer | Profil connecte |
| GET | /api/users | Admin | Liste utilisateurs |
| POST | /api/users | Admin | Creer utilisateur |
| PUT | /api/users/:id | Admin | Modifier utilisateur |
| PATCH | /api/users/:id/statut | Admin | Activer/desactiver |
| DELETE | /api/users/:id | Admin | Supprimer |
| GET | /api/commandes | Bearer | Toutes (admin) / siennes (gerant) |
| POST | /api/commandes | Bearer | Creer commande + facture auto |
| GET | /api/commandes/:id | Bearer | Detail |
| PATCH | /api/commandes/:id/statut | Bearer | Changer statut |
| DELETE | /api/commandes/:id | Bearer | Supprimer |
| GET | /api/factures | Bearer | Toutes les factures |
| GET | /api/factures/:id | Bearer | Detail |
| PATCH | /api/factures/:id/statut | Bearer | payee / impayee |
| GET | /api/clients | Bearer | Liste clients |
| POST | /api/clients | Bearer | Creer ou retrouver (dedup) |
| GET | /api/depenses | Bearer | Liste depenses |
| POST | /api/depenses | Admin | Creer depense |
| DELETE | /api/depenses/:id | Admin | Supprimer depense |

## Deploiement (Render)

1. Nouveau Web Service > connecter le depot GitHub.
2. **Build Command** : `npm install`
3. **Start Command** : `node index.js`
4. Variables d'environnement a definir :
   - `MONGO_URI` (ton URI Atlas)
   - `JWT_SECRET` (chaine aleatoire longue)
   - `JWT_EXPIRES_IN=7d`
   - `NODE_ENV=production`
   - `ALLOWED_ORIGINS=*` (ou l'URL de ton front)

## Seed initial

```bash
node src/scripts/seed.js
```
Cree les 4 utilisateurs par defaut (admin + 3 gerants).

## Comptes par defaut

| Email | Mot de passe | Role |
|-------|-------------|------|
| admin@pressing.com | admin123 | Admin |
| gerant@pressing.com | gerant123 | Gerant |
| ibrahim@pressing.com | gerant123 | Gerant |
| mariame@pressing.com | gerant123 | Gerant (inactif) |
