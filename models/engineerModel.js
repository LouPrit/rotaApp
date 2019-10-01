const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const engineerSchema = new Schema({
    engineerName: { type: String, required: true },
    engineerTelNum: { type: String, required: true },
    colour: { type: String, required: true },
    teamName: { type: String, required: true }
});

/**
 * Convert our engineerSchema into a Model we can use and exports it (Creates a collection in the 'rota' database called 'engineers').
 * Models are fancy constructors compiled from Schema definitions and are responsible for creating and reading documents from the underlying MongoDB database.
 */
module.exports = mongoose.model('Engineer', engineerSchema, 'engineers');