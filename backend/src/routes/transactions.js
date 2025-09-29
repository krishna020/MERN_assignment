const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const controller = require('../controllers/transactionController');

router.post('/', auth, rbac('admin','user'), controller.create);
router.get('/', auth, controller.list);
router.put('/:id', auth, rbac('admin','user'), controller.update);
router.delete('/:id', auth, rbac('admin','user'), controller.remove);

module.exports = router;
