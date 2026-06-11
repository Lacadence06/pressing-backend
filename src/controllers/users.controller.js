const User = require('../models/User');

/** GET /api/users */
exports.getAll = async (_req, res) => {
  try {
    const users = await User.find().select('-password -__v').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/** POST /api/users */
exports.create = async (req, res) => {
  try {
    const { prenom, nom, email, password, telephone, role } = req.body;
    if (!prenom || !nom || !email || !password)
      return res.status(400).json({ message: 'Champs requis : prenom, nom, email, password.' });
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    const user = await User.create({ prenom, nom, email, password, telephone, role: role || 'gerant' });
    res.status(201).json(user.toSafeObject());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/** PUT /api/users/:id */
exports.update = async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    Object.assign(user, data);
    if (password) user.password = password; // re-hash via pre-save
    await user.save();
    res.json(user.toSafeObject());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/** PATCH /api/users/:id/statut */
exports.toggleActif = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    user.actif = !user.actif;
    await user.save();
    res.json({ id: user._id, actif: user.actif });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/** DELETE /api/users/:id */
exports.remove = async (req, res) => {
  try {
    // M8 : un admin ne peut pas supprimer son propre compte.
    if (req.params.id === String(req.user.id))
      return res.status(403).json({ message: 'Impossible de supprimer son propre compte.' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
