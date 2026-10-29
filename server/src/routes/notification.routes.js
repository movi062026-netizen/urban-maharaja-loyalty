const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { mongoIdParam } = require('../validators/business.validator');
const notifications = require('../services/notification.service');
const controller = require('../controllers/notification.controller');

// Live notification stream (Server-Sent Events)
router.get('/stream', authenticate, notifications.subscribe);

// Stored notification history
router.get('/', authenticate, controller.listMine);
router.patch('/read-all', authenticate, controller.markAllRead);
router.patch('/:id/read', authenticate, mongoIdParam, validate, controller.markRead);
router.delete('/', authenticate, controller.clearMine);

// Web Push (device notifications)
router.get('/push/config', controller.pushConfig);
router.post('/push/subscribe', authenticate, controller.subscribePush);
router.post('/push/unsubscribe', authenticate, controller.unsubscribePush);

module.exports = router;
