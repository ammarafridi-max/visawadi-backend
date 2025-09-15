const authController = require('../controllers/auth.controller');
const visaController = require('../controllers/visa.controller');
const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(visaController.getAllVisas)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    visaController.createVisa
  );
router
  .route('/:slug')
  .get(visaController.getVisa)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    visaController.updateVisa
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    visaController.deleteVisa
  );

module.exports = router;
