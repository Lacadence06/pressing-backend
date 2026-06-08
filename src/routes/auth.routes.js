const router = require('express').Router();
const auth   = require('../middleware/auth');
const c      = require('../controllers/auth.controller');

router.post('/login',  c.login);           // connexion — public
router.post('/logout', auth, c.logout);    // deconnexion — token requis
router.get('/me',      auth, c.me);        // profil connecte — token requis

module.exports = router;
