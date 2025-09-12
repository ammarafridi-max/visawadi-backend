const visaController = require('../controllers/visa.controller');
const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(visaController.getAllVisas)
  .post(visaController.createVisa);
router
  .route('/:slug')
  .get(visaController.getVisa)
  .patch(visaController.updateVisa)
  .delete(visaController.deleteVisa);

module.exports = router;
