const express = require('express');
const existenceController = require('../controllers/existenceController');

const router = express.Router();

router.route('/newexistence/').post(existenceController.createExistence);
router.route('/q1results/').post(existenceController.bringQ1Results);

module.exports = router;
