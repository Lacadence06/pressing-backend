const { Schema, model } = require('mongoose');

const ArticleSchema = new Schema({
  typeVetement:  { type: String, required: true },
  quantite:      { type: Number, required: true, min: 1 },
  prixUnitaire:  { type: Number, required: true, min: 0 },
  sousTotal:     { type: Number, required: true, min: 0 },
}, { _id: true });

const HistorySchema = new Schema({
  from:       { type: String },
  to:         { type: String, required: true },
  at:         { type: String, required: true },
  byUserId:   { type: String },
  byUserName: { type: String },
  message:    { type: String },
}, { _id: false });

const CommandeSchema = new Schema({
  numeroCommande:  { type: String, required: true, unique: true },
  nomClient:       { type: String, required: true, trim: true },
  telephoneClient: { type: String, trim: true },
  clientId:        { type: Schema.Types.ObjectId, ref: 'Client' },
  articles:        { type: [ArticleSchema], required: true },
  total:           { type: Number, required: true, min: 0 },
  statut: {
    type: String,
    enum: ['en_attente','en_cours','termine','livre','annule'],
    default: 'en_attente',
  },
  date:          { type: String, required: true }, // YYYY-MM-DD
  notes:         { type: String, trim: true },
  gerantId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gerantNom:     { type: String, required: true },
  createdBy:     { type: String },
  createdByRole: { type: String },
  history:       { type: [HistorySchema], default: [] },
}, { timestamps: true });

// I4 : index pour le filtrage rapide par gerant.
CommandeSchema.index({ gerantId: 1, createdAt: -1 });

module.exports = model('Commande', CommandeSchema);
