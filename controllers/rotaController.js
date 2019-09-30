const rotaModel = require('../models/rotaModel');

exports.saveRota = (req, res, next) => {
    const rota = new rotaModel(req.body); //Create a new 'rota' object (our model) from the data sent to us

    //If rota DOESN'T exist a new one will be created (upsert: true), if a rota DOES exist we will update the existing rota
    rotaModel.findOneAndUpdate({ teamName: rota.teamName }, {$set:{teamName: rota.teamName, teamTelNum: rota.teamTelNum, events: rota.events}}, {new: true, upsert: true, useFindAndModify: false}, function (err, rota) {
        if (err) return next(err);

        res.status(200).send(rota)
    });
}

exports.getRota = (req, res, next) => {
    rotaModel.find({ teamName: req.params.teamName }, function (err, rota) {
        if (err) return next(err);
        res.status(200).send(rota); //Rota will either contain a rota if one was found, or will send an empty array.
    });
}