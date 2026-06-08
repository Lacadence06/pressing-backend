const Client = require('../models/Client');

/** GET /api/clients — admin: tous, gerant: les siens */
exports.getAll = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { gerantId: req.user.id };
    const clients = await Client.find(filter).sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/** GET /api/clients/:id */
exports.getOne = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client introuvable.' });
    res.json(client);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * POST /api/clients — Deduplication par nom (insensible a la casse).
 * Si client meme nom existe -> retourner l'existant.
 * Sinon creer un nouveau.
 */
exports.createOrFind = async (req, res) => {
  try {
    const { nom, telephone, email, adresse } = req.body;
    if (!nom || !nom.trim())
      return res.status(400).json({ message: 'Le nom du client est requis.' });
    const existing = await Client.findOne({ nom: { $regex: new RegExp(`^${nom.trim()}$`, 'i') } });
    if (existing) return res.status(200).json({ ...existing.toObject(), _existed: true });
    const client = await Client.create({
      nom: nom.trim(),
      telephone: telephone && telephone.trim() || undefined,
      email: email && email.trim().toLowerCase() || undefined,
      adresse: adresse && adresse.trim() || undefined,
      gerantId: req.user.id,
    });
    res.status(201).json(client);
  } catch (err) { res.status(500).json({ message: err.message }); }
};