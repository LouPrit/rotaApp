const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    teamName: { type: String, required: true, index: { unique: true } },
    teamTelNum: { type: String, required: true } //Has to be type String as we can't have a Number type starting with 0
});

/**
 * Convert our notesSchema into a Model we can use and exports it (Creates a collection in the 'rota' database called 'teams').
 * Models are fancy constructors compiled from Schema definitions and are responsible for creating and reading documents from the underlying MongoDB database.
 */
module.exports = mongoose.model('Team', teamSchema, 'teams');