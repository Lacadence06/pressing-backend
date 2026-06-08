const { Schema, model } = require('mongoose');

const ClientSchema = new Schema({
  nom:       { type: String, required: true, trim: true },
  telephone: { type: String, trim: true },
  email:     { type: String, trim: true, lowercase: true },
  adresse:   { type: String, trim: true },
  gerantId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Index pour la déduplication insensible à la casse
ClientSchema.index({ nom: 1 });

module.exports = model('Client', ClientSchema);
