const express = require('express');
const router = express.Router();
const rotaController = require('../controllers/rotaController');

/**
 * Handles POST requests to /rota/ for saving a rota
 */
router.post("/", rotaController.saveRota);

router.get("/:teamName", rotaController.getRota);

module.exports = router;