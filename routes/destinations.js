const express = require('express');
const router = express.Router();
const destinationsCtrl = require('../controllers/destinations');

router.post('/flights/:id/destinations', destinationsCtrl.create);
router.delete('/destinations/:id', destinationsCtrl.delete);

module.exports = router;