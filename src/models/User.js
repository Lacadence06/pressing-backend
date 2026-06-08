const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  prenom:    { type: String, required: true, trim: true },
  nom:       { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 4 },
  telephone: { type: String, trim: true },
  role:      { type: String, enum: ['admin', 'gerant'], default: 'gerant' },
  actif:     { type: Boolean, default: true },
}, { timestamps: true });

// Hash du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Comparaison mot de passe
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Ne jamais exposer le mot de passe
UserSchema.methods.toSafeObject = function () {
  const { password, __v, ...safe } = this.toObject();
  return safe;
};

module.exports = model('User', UserSchema);
