const { Schema, model } = require('mongoose');

/**
 * Token JWT révoqué (logout).
 * TTL : MongoDB supprime automatiquement le document à expireAt.
 * Résout C2 : la blacklist survit aux redémarrages Render.
 */
const RevokedTokenSchema = new Schema({
  token:    { type: String, required: true, unique: true },
  expireAt: { type: Date, required: true },
});

// Index TTL : suppression automatique du document une fois le JWT expiré.
RevokedTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model('RevokedToken', RevokedTokenSchema);
