const express = require('express');

let router = express.Router();
let clientController = require('../controllers/clientController');

router.post('/', clientController.upload);

router.get('/', clientController.list);

router.get('/:id', clientController.retrieveById);

module.exports = router;