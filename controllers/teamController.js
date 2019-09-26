const teamModel = require('../models/teamModel');

exports.newTeam = (req, res, next) => {
    const team = new teamModel(req.body); //Create a new 'team' object (our model) from the data sent to us

    team.save()
        .then(reply => {
            console.log(`Team with name: ${team.teamName} and number: ${team.teamTelNum} successfully created`);
            res.status(200).send(reply)
        })
        .catch(error => next(error));
}