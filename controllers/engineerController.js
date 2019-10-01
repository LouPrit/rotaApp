const engineerModel = require('../models/engineerModel');

exports.saveEngineer = (req, res, next) => {
    const engineer = new engineerModel(req.body); //Create a new 'engineer' object from the data sent to us

    engineerModel.find({ engineerName: engineer.engineerName, teamName: engineer.teamName }, function (err, engineers) {
        if (err) return next(err);

        if (engineers.length > 0) {
            const engineerObj = { //Create a object to send to frontend with basic details of existing engineer
                exists: true,
                teamName: engineers[0].teamName
            };
            console.log(`Engineer with name ${engineer.engineerName} already exists in team ${engineer.teamName}`);
            res.status(200).json(engineerObj);
        } else {
            engineer.save()
                .then(reply => {
                    console.log(`Engineer ${engineer.engineerName} successfully created in team ${engineer.teamName}`);
                    res.status(200).send(reply)
                })
                .catch(error => next(error));
        }
    });
}