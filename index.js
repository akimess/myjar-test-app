require('./server/config/config');

const express = require('express');
const bodyParser = require('body-parser');

let { mongoose } = require('./server/db/mongoose');
let clients = require('./server/routes/clients');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(express.static('./build'));

app.use('/clients', clients);

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = { app };