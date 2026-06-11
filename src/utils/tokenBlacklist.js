/**
 * Liste noire des tokens revoqués — persistée en MongoDB (TTL auto-purge).
 * C2 : survit aux redémarrages serveur (Render free tier).
 * Cache mémoire en plus pour éviter une requête DB à chaque appel API.
 */
const jwt = require('jsonwebtoken');
const RevokedToken = require('../models/RevokedToken');

const _cache = new Set(); // cache lecture rapide

/** Ajoute un token à la liste noire (appelé au logout). */
async function addToBlacklist(token) {
  if (!token) return;
  _cache.add(token);
  try {
    const payload = jwt.decode(token);
    const expireAt = payload && payload.exp
      ? new Date(payload.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 3600 * 1000);
    await RevokedToken.updateOne(
      { token },
      { $setOnInsert: { token, expireAt } },
      { upsert: true }
    );
  } catch (e) {
    console.warn('[blacklist] persist failed:', e.message);
  }
}

/** Retourne true si le token a été révoqué (cache puis DB). */
async function isBlacklisted(token) {
  if (_cache.has(token)) return true;
  try {
    const found = await RevokedToken.exists({ token });
    if (found) _cache.add(token);
    return !!found;
  } catch {
    return false; // en cas d'erreur DB, ne pas bloquer les utilisateurs légitimes
  }
}

function size() { return _cache.size; }

module.exports = { addToBlacklist, isBlacklisted, size };
