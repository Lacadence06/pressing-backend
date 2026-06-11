const { Schema, model } = require('mongoose');

const FactureSchema = new Schema({
  numeroFacture: { type: String, required: true, unique: true },
  clientId:      { type: Schema.Types.ObjectId, ref: 'Client' },
  commandeId:    { type: Schema.Types.ObjectId, ref: 'Commande', required: true },
  montant:       { type: Number, required: true, min: 0 },
  statut:        { type: String, enum: ['payee', 'impayee'], default: 'impayee' },
  dateCreation:  { type: String, required: true }, // YYYY-MM-DD
  gerantId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy:     { type: String },
}, { timestamps: true });

// I4 : index pour le filtrage par gerant et la jointure par commande.
FactureSchema.index({ gerantId: 1, createdAt: -1 });
FactureSchema.index({ commandeId: 1 });

module.exports = model('Facture', FactureSchema);
