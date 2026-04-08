const express = require('express');
const router = express.Router();

const { formLimiter, loginLimiter } = require('../middleware/rateLimiter');
const { requireAdmin } = require('../middleware/auth');

const contactController = require('../controllers/contactController');
const appointmentController = require('../controllers/appointmentController');
const promoController = require('../controllers/promoController');
const adminController = require('../controllers/adminController');

// Admin Auth
router.post('/admin/login', loginLimiter, adminController.login);
router.post('/admin/logout', adminController.logout);
router.get('/admin/check-auth', adminController.checkAuth);

// Contact Forms
router.post('/contact', formLimiter, contactController.submitContact);
router.get('/contact', requireAdmin, contactController.getContacts);
router.delete('/contact/:id', requireAdmin, contactController.deleteContact);
router.put('/contact/:id/resolve', requireAdmin, contactController.resolveContact);

// Appointments
router.post('/appointments', formLimiter, appointmentController.bookAppointment);
router.get('/appointments', requireAdmin, appointmentController.getAppointments);
router.delete('/appointments/:id', requireAdmin, appointmentController.deleteAppointment);
router.put('/appointments/:id/resolve', requireAdmin, appointmentController.resolveAppointment);

// Promo Banner
router.get('/promo', promoController.getPromo);
router.put('/promo', requireAdmin, promoController.updatePromo);

module.exports = router;
