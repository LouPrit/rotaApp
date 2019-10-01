const express = require('express');
const router = express.Router();
const rotaController = require('../controllers/rotaController');

/**
 * Handles POST requests to /rota/ for saving a rota
 */
router.post("/", rotaController.saveRota);

/**
 * Handles GET requests /rota/:teamName for getting a specific rota
 */
router.get("/:teamName", rotaController.getRota);

/**
 * Handles GET requests to /rota/active/:teamName for getting active on-call engineer for given rota
 */
router.get("/active/:teamName", rotaController.getActive);

module.exports = router;