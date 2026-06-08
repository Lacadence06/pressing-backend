const jwt  = require('jsonwebtoken');
const User = require('../models/User');
const { addToBlacklist } = require('../utils/tokenBlacklist');

/** POST /api/auth/login */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });

    if (!user.actif)
      return res.status(403).json({ message: 'Ce compte est desactive. Contactez l\'administrateur.' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** POST /api/auth/logout
  * Révoque le token en l'ajoutant à la liste noire.
  * Le client doit supprimer le token de son stockage local.
  */
exports.logout = (req, res) => {
  try {
    addToBlacklist(req.token);
    res.json({ message: 'Deconnexion reussie.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** GET /api/auth/me — retourne le profil de l'utilisateur connecté */
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    res.json({
      id:            user._id,
      prenom:        user.prenom,
      nom:           user.nom,
      email:         user.email,
      telephone:     user.telephone,
      role:          user.role,
      actif:         user.actif,
      nomComplet:    user.prenom + ' ' + user.nom,
      createdAt:     user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
