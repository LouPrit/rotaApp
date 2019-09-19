const express = require('express');
const router = express.Router();
const statsController = require('../controllers/rotaController');

/**
 * Handles GET requests to /rota/ for stats retreival - PROTECTED ROUTE
 */
router.get("/", statsController.getActive);

module.exports = router;