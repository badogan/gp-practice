const express = require('express');
const getIPDetailsController = require('../controllers/getIPDetailsController');

const router = express.Router();

router.get('/', getIPDetailsController.getIPDetails);

module.exports = router;
