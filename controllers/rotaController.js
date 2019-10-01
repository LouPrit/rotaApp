const rotaModel = require('../models/rotaModel');
const engineerModel = require('../models/engineerModel');
var moment = require('moment');
moment().format();

exports.saveRota = (req, res, next) => {
    const rota = new rotaModel(req.body); //Create a new 'rota' object (our model) from the data sent to us

    //If rota DOESN'T exist a new one will be created (upsert: true), if a rota DOES exist we will update the existing rota
    rotaModel.findOneAndUpdate({ teamName: rota.teamName }, { $set: { teamName: rota.teamName, teamTelNum: rota.teamTelNum, events: rota.events } }, { new: true, upsert: true, useFindAndModify: false }, function (err, rota) {
        if (err) return next(err);

        res.status(200).send(rota)
    });
}

exports.getRota = (req, res, next) => {
    rotaModel.find({ teamName: req.params.teamName }, function (err, rota) {
        if (err) return next(err);
        engineerModel.find({ teamName: req.params.teamName }, function (err, engineers) {
            const rotaWithEngineers = {
                rota: rota,
                engineers: engineers
            }
            res.status(200).send(rotaWithEngineers);
        });
    });
}

/**
 * Gets the current active oncall engineer name, tel number and team tel number.
 * First a 'find' is done using the url parameter 'teamName' to get the correct rota,
 * Once we have the correct rota we use filter to find the current active engineer
 * before creating a new object with the details we required (name, tel num, team tel num) and sending it to the client.
 */
exports.getActive = (req, res, next) => {
    rotaModel.find({ teamName: req.params.teamName }, function (err, rota) {
        if (err) return next(err);
        if (rota.length > 0) {
            let active = rota[0].events.filter(event => {
                let today = moment(new Date()).format("L HH:mm:ss");
                if (today > event.start && today < event.end) {
                    return event;
                } else {
                    return false;
                }
            });

            let engDetails = {
                engineerName: active[0].title,
                engineerTelNum: active[0].telNum,
                teamTelNum: rota[0].teamTelNum
            }
            res.status(200).send(engDetails);

        } else {
            res.status(404).send("No Rota Found");
        }
    }
    );
}