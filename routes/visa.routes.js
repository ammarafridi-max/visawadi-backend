const visaController = require('../controllers/visa.controller');
const express = require('express');
const router = express.Router();

router.route('/');

router.route('/:slug').get(visaController.getVisa);

module.exports = router;
