const teamModel = require('../models/teamModel');

exports.newTeam = (req, res, next) => {
    const team = new teamModel(req.body); //Create a new 'team' object (our model) from the data sent to us

    teamModel.find({ teamName: team.teamName }, function (err, teams) { //Check to see if a team with provided name already exists
        if (err) return next(err);

        if (teams.length !== 0) { //'teamModel.find' returns an array so check to see if it contains data (Found matching accounts already registered)
            const teamObj = { //Create a object to send to frontend with basic details of existing account
                exists: true,
                teamName: teams[0].teamName
            };
            console.log(`Team with name ${team.teamName} already exists`);
            res.status(200).json(teamObj);
        } else {
            team.save()
                .then(reply => {
                    console.log(`Team with name: ${team.teamName} and number: ${team.teamTelNum} successfully created`);
                    res.status(200).send(reply)
                })
                .catch(error => next(error));
        }
    });
}

exports.getTeams = (req, res, next) => {
    teamModel.find({}, function (err, teams) { //Check to see if a team with provided name already exists
        if (err) return next(err);

        res.status(200).json(teams);
    });
}

