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
exports.logout = async (req, res) => {
  try {
    await addToBlacklist(req.token);
    res.json({ message: 'Deconnexion reussie.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** PATCH /api/auth/password — change le mot de passe de l'utilisateur connecte */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Mot de passe actuel et nouveau mot de passe requis.' });
    if (newPassword.length < 4)
      return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 4 caracteres.' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    const valid = await user.comparePassword(currentPassword);
    if (!valid) return res.status(401).json({ message: 'Mot de passe actuel incorrect.' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Mot de passe modifie avec succes.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
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
