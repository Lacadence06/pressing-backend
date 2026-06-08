/**
 * SEED — Initialise la base pressingDB avec les utilisateurs de base.
 * Idempotent : peut etre relance sans creer de doublons (upsert par email).
 * Usage : node src/scripts/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');

const USERS = [
  { prenom:'Amadou',  nom:'Kone',     email:'admin@pressing.com',   password:'admin123',   role:'admin',  telephone:'+225 07 08 09 10 11', adresse:'Abidjan, Cocody',      actif:true  },
  { prenom:'Fatima',  nom:'Traore',   email:'gerant@pressing.com',  password:'gerant123',  role:'gerant', telephone:'+225 05 06 07 08 09', adresse:'Abidjan, Yopougon',    actif:true  },
  { prenom:'Ibrahim', nom:'Coulibaly',email:'ibrahim@pressing.com', password:'gerant123',  role:'gerant', telephone:'+225 01 02 03 04 05', adresse:'Abidjan, Marcory',     actif:true  },
  { prenom:'Mariame', nom:'Diallo',   email:'mariame@pressing.com', password:'gerant123',  role:'gerant', telephone:'+225 07 77 88 99 00', adresse:'Abidjan, Treichville', actif:false },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connecte :', mongoose.connection.host);

  let created = 0, updated = 0;
  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 12);
    const result = await User.findOneAndUpdate(
      { email: u.email },
      { $setOnInsert: { prenom:u.prenom, nom:u.nom, email:u.email, password:hash, role:u.role, telephone:u.telephone, adresse:u.adresse, actif:u.actif } },
      { upsert:true, new:true, rawResult:true }
    );
    if (result.lastErrorObject && result.lastErrorObject.upserted) { created++; console.log('  CREE  :', u.email); }
    else { updated++; console.log('  EXISTE:', u.email); }
  }
  console.log('Seed termine —', created, 'cree(s),', updated, 'deja present(s).');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(e => { console.error('Seed ERREUR:', e.message); process.exit(1); });
