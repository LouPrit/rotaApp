const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

/**
 * Handles POST requests to /team/ 
 */
router.post("/", teamController.newTeam);

module.exports = router;