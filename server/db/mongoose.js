let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI,
    {
        promiseLibrary: global.Promise
    });

module.exports = { mongoose };
