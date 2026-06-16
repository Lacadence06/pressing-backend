const router=require('express').Router();
const auth=require('../middleware/auth');
const c=require('../controllers/commandes.controller');
// ── Route publique (sans auth) : recherche par numéro ou nom client ──
router.get('/search',c.searchPublic);
router.get('/',auth,c.getAll);
router.get('/:id',auth,c.getOne);
router.post('/',auth,c.create);
router.patch('/:id/statut',auth,c.updateStatut);
router.delete('/:id',auth,c.remove);
module.exports=router;
