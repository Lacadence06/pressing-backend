const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../utils/tokenBlacklist');

/**
 * Middleware d'authentification JWT.
 * - Vérifie la présence et la validité du token Bearer.
 * - Vérifie que le token n'est pas révoqué (liste noire).
 * - Injecte req.user = { id, email, role } et req.token.
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token manquant. Veuillez vous connecter.' });

  const token = header.split(' ')[1];

  if (isBlacklisted(token))
    return res.status(401).json({ message: 'Session expirée. Veuillez vous reconnecter.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user  = { id: payload.id, email: payload.email, role: payload.role };
    req.token = token; // exposé pour le logout
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Token expiré. Veuillez vous reconnecter.'
      : 'Token invalide.';
    return res.status(401).json({ message: msg });
  }
}

module.exports = authMiddleware;
