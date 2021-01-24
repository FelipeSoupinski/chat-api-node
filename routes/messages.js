const express = require('express');
const router = express.Router();

const MessagesController = require('../controllers/messages-controller');

router.get('/', MessagesController.getRequest);
router.put('/', MessagesController.putRequest);

module.exports = router;