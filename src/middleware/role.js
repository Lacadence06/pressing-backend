/**
 * Génère un middleware qui autorise uniquement les rôles listés.
 * Usage : router.get('/', auth, requireRole('admin'), controller)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé — rôle insuffisant.' });
    }
    next();
  };
}

module.exports = requireRole;
