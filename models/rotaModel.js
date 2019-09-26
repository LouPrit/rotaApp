const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let server = 'mongodb://localhost:27017/rota';

console.log(`Attempting to connect to the database...`);
mongoose.connect(server, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to rota database"))
    .catch(error => {
        console.log(`Couldn't connect to the database: \n${error}`);
        process.exit();
    });
mongoose.set('useCreateIndex', true); //For the Schema to keep our id unique (index: { unique: true })

/**
* Everything in Mongoose starts with a Schema. 
* Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
*/
const rotaSchema = new Schema({
    teamName: { type: String, required: true, index: { unique: true } },
    events: [{
        id: { type: String, required: true, index: { unique: true } },
        start: { type: String, required: true },
        end: { type: String, required: true },
        title: { type: String, required: true },
        hexColor: { type: String, required: true }
    }]
});

/**
 * Convert our notesSchema into a Model we can use and exports it (Creates a collection in the 'rota' database called 'rotas').
 * Models are fancy constructors compiled from Schema definitions and are responsible for creating and reading documents from the underlying MongoDB database.
 */
module.exports = mongoose.model('Rota', rotaSchema, 'rotas');