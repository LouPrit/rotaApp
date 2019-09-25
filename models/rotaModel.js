const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let server = 'mongodb://localhost:27017/rota';

console.log(`Attempting to connect to the database...`);
mongoose.connect(server, { useNewUrlParser: true })
    .then(() => console.log("Connected to rota database"))
    .catch(error => {
        console.log(`Couldn't connect to the database: \n${error}`);
        process.exit();
    });