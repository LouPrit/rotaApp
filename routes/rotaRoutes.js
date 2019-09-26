const express = require('express');
const router = express.Router();
const rotaController = require('../controllers/rotaController');

/**
 * Handles GET requests to /rota/ 
 */
router.get("/", rotaController.getActive);

module.exports = router;