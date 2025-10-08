const express = require('express');
const PublicController = require('../controllers/public.controller');
const router = express.Router();

router.get('/', PublicController.home);
router.get('/events', PublicController.listEvents);
router.get('/events/:id', PublicController.getEventById);

module.exports = router;