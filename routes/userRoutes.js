const express = require('express');
// const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
// const bookController = require('../controllers/bookController');
const appointmentController = require('../controllers/appointmentController');
const getIPDetailsController = require('../controllers/getIPDetailsController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/getIPDetails', getIPDetailsController.getIPDetails);

router
  .route('/:userId/appointments')
  .post(authController.protect, appointmentController.createAppointment)
  .get(authController.protect, appointmentController.getAllAppointments);

router
  .route('/:userId/appointments/:appointmentId')
  .get(authController.protect, appointmentController.getAppointment)
  .delete(authController.protect, appointmentController.deleteAppointment)
  .patch(authController.protect, appointmentController.updateAppointment);

module.exports = router;
