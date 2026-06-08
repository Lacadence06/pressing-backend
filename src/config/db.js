const mongoose = require('mongoose');

/**
 * Connexion MongoDB Atlas via Mongoose.
 * Appelée une seule fois au démarrage du serveur.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI manquant dans les variables d'environnement.");
  await mongoose.connect(uri);
  console.log('[MongoDB] Connexion établie :', mongoose.connection.host);
}

module.exports = connectDB;
