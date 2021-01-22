const express = require('express');
const router = express.Router();

const RealtimeController = require('../controllers/realtime-controller');

router.get('/', RealtimeController.getRequest);
router.post('/', RealtimeController.postRequest);
router.put('/', RealtimeController.putRequest);
router.delete('/', RealtimeController.deleteRequest);

module.exports = router;