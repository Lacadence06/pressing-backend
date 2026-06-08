require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[TOP CLEAN Pressing API] Serveur demarré sur le port ${PORT} — env: ${process.env.NODE_ENV || "development"}`);
  });
}).catch((err) => {
  console.error("Echec de connexion MongoDB :", err.message);
  process.exit(1);
});
