const router=require('express').Router();
const auth=require('../middleware/auth');
const role=require('../middleware/role');
const c=require('../controllers/depenses.controller');
router.get('/',auth,c.getAll);
router.post('/',auth,role('admin'),c.create);
router.put('/:id',auth,role('admin'),c.update);
router.delete('/:id',auth,role('admin'),c.remove);
module.exports=router;
