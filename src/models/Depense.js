const { Schema, model } = require('mongoose');

const DepenseSchema = new Schema({
  nom:       { type: String, required: true, trim: true },
  categorie: {
    type: String,
    enum: ['lessive','electricite','eau','loyer','salaire','fourniture','transport','autre'],
    default: 'autre',
  },
  quantite:  { type: Number, required: true, min: 1 },
  prix:      { type: Number, required: true, min: 0 },
  total:     { type: Number, required: true, min: 0 },
  date:      { type: String, required: true }, // format YYYY-MM-DD
  gerantId:  { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// I4 : index pour le filtrage par gerant et par date.
DepenseSchema.index({ gerantId: 1, date: -1 });

module.exports = model('Depense', DepenseSchema);
