const router=require('express').Router();
const auth=require('../middleware/auth');
const c=require('../controllers/commandes.controller');
router.get('/',auth,c.getAll);
router.get('/:id',auth,c.getOne);
router.post('/',auth,c.create);
router.patch('/:id/statut',auth,c.updateStatut);
router.delete('/:id',auth,c.remove);
module.exports=router;
