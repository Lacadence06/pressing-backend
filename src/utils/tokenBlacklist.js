/**
 * Liste noire des tokens revoqués (stockage mémoire).
 * Purge automatique à chaque redémarrage du serveur.
 * Les tokens expirent naturellement via la durée JWT (JWT_EXPIRES_IN).
 * → Pour la production haute-disponibilite, remplacer par Redis.
 */
const _blacklist = new Set();

/** Ajoute un token à la liste noire (appele au logout). */
function addToBlacklist(token) { if (token) _blacklist.add(token); }

/** Retourne true si le token a été révoqué. */
function isBlacklisted(token) { return _blacklist.has(token); }

/** Taille de la liste (utile pour le monitoring). */
function size() { return _blacklist.size; }

module.exports = { addToBlacklist, isBlacklisted, size };
