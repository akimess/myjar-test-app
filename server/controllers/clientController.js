let { Client } = require('../models/client');
let ObjectId = require('mongoose').Types.ObjectId;

exports.upload = function (req, res) {
    let clientData = req.body;

    let clientObj = new Client(clientData);

    clientObj.save().then((client) => {
        res.status(200).json({
            success: true,
            message: 'Client was succesfully added'
        });
    }).catch((e) => {
        if(e.errors) {
            let error_info = e.errors;
            let error_data = {
                email: error_info['email'] ? error_info['email'].message : '',
                phone: error_info['phone'] ? error_info['phone'].message : '',
            };

            res.status(400).json({
                success: false,
                message: 'Check the form for errors',
                errors: error_data
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Error Message: ' + e.message
            });
        }
    })
}

exports.list = function (req, res) {
    let search = {};

    if(req.query.search){
        search = {email: {'$regex': req.query.search, '$options': 'i'}};
    }

    Client.find(search, '_id email').then((clients) => {
        res.status(200).send({
            success: true,
            data: clients
        });
    }).catch((e) => {
        res.status(400).send({
            success: false,
            data: e.message
        })
    })
}

exports.retrieveById = function (req, res) {
    let client_id = req.params['id'];

    Client.findOne({_id: new ObjectId(client_id)}, '-_id -__v').then((client) => {
        res.status(200).json({
            success: true,
            data: client
        });
    }).catch((e) => {
        res.status(400).send({
            success: false,
            data: e.message
        })
    })
}