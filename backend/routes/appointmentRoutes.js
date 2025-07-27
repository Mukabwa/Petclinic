const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getUserAppointments);
router.get('/slots', appointmentController.getAvailableSlots);

module.exports = router;