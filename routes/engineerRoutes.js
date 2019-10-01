const express = require('express');
const router = express.Router();
const engineerController = require('../controllers/engineerController');

/**
 * Handles POST requests to /rota/ for saving a rota
 */
router.post("/", engineerController.saveEngineer);

module.exports = router;