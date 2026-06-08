const express = require('express');
const cors    = require('cors');

const authRoutes      = require('./routes/auth.routes');
const usersRoutes     = require('./routes/users.routes');
const commandesRoutes = require('./routes/commandes.routes');
const facturesRoutes  = require('./routes/factures.routes');
const clientsRoutes   = require('./routes/clients.routes');
const depensesRoutes  = require('./routes/depenses.routes');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// En production : definir ALLOWED_ORIGINS=https://mon-frontend.com,https://...
// En dev ou mobile Expo : laisser * (toutes origines)
const rawOrigins = (process.env.ALLOWED_ORIGINS || '*').split(',').map(o => o.trim());
const corsOptions = rawOrigins.includes('*')
  ? { origin: '*' }
  : { origin: rawOrigins, credentials: true };
app.use(cors(corsOptions));

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/users',     usersRoutes);
app.use('/api/commandes', commandesRoutes);
app.use('/api/factures',  facturesRoutes);
app.use('/api/clients',   clientsRoutes);
app.use('/api/depenses',  depensesRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', service: 'pressing-mobile-backend', env: process.env.NODE_ENV }));

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route introuvable.' }));

// ─── Erreur globale ───────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) console.error('[Erreur]', err.stack || err.message);
  res.status(status).json({ message: err.message || 'Erreur interne du serveur.' });
});

module.exports = app;
