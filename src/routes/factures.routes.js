const router=require('express').Router();
const auth=require('../middleware/auth');
const c=require('../controllers/factures.controller');
router.get('/',auth,c.getAll);
router.get('/:id',auth,c.getOne);
router.patch('/:id/statut',auth,c.updateStatut);
module.exports=router;
