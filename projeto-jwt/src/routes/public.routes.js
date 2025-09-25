const express = require('express');
const PublicController = require('../controllers/public.controller');
const EventsController = require('../controllers/events.controller');
const router = express.Router();

router.get('/', PublicController.home);
router.get('/events', EventsController.list);

module.exports = router;