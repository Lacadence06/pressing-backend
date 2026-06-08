const router=require('express').Router();
const auth=require('../middleware/auth');
const c=require('../controllers/clients.controller');
router.get('/',auth,c.getAll);
router.get('/:id',auth,c.getOne);
router.post('/',auth,c.createOrFind);
module.exports=router;
