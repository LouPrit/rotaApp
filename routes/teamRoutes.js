const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

/**
 * Handles POST requests to /team/ for creating a new team
 */
router.post("/", teamController.newTeam);

/**
 * Handles GET requests to /team/ for retrieving list of all configured teams
 */
router.get("/", teamController.getTeams);

module.exports = router;