const express = require('express');
const existenceController = require('../controllers/existenceController');

const router = express.Router();

router.route('/newexistence/').post(existenceController.createExistence);
router.route('/q1results/').post(existenceController.bringQ1Results);
router.route('/q2results/').post(existenceController.bringQ2Results);

module.exports = router;
