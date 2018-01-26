const mongoose = require('mongoose');
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const crypto = require('crypto');

const algorithm = 'aes-256-gcm';

let ClientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email required'],
        validate: {
            validator: function (v) {
                let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(v);
            },
            message: 'Not a valid email'
        }
    },
    phone: {
        type: String,
        require: [true, 'Phone number required'],
        validate: {
            validator: function (v) {
                try {
                    const phoneNumber = phoneUtil.parseAndKeepRawInput(v, 'GB');
                    return phoneUtil.isValidNumber(phoneNumber);
                } catch (err) {
                    return false;
                }

            },
            message: 'Not a valid phone number'
        }
    }
}, {
        strict: false
    })

ClientSchema.post('findOne', function (client) {
    
    if (client.phone) {

        let baseData = new Buffer(client.phone, 'base64');
        let iv = baseData.slice(0, 12);
        let enc = baseData.slice(12, baseData.length - 16);
        let tag = baseData.slice(baseData.length - 16, baseData.length);

        let decipher = crypto.createDecipheriv(algorithm, process.env.PASS, iv);
        decipher.setAuthTag(tag);

        let dec = decipher.update(enc, 'binary', 'utf8') + decipher.final('utf8');

        client.phone = dec.replace(/.(?=.{4})/g, "#");
    }

})

ClientSchema.pre('save', function (next) {
    let client = this;
    let error = '';
    let objKeys = Object.keys(client.toJSON()).filter(x => x != '_id');

    if (objKeys.length !== 10) {
        error = new Error('There should be 10 fields present');
    } else {
        objKeys.forEach((key) => {
            console.log(client[key], typeof client[key] === 'object');
            if (!client[key]) {
                error = new Error('Values can not be empty');
            } else if (typeof client[key] === 'object') {
                error = new Error('Values can not be an Object or Array');
            }

        })
    }

    error && next(error);

    if (client.isModified('phone')) {
        let phoneNumber = phoneUtil.parseAndKeepRawInput(client.phone, 'GB');
        phoneNumber = phoneUtil.format(phoneNumber, PNF.NATIONAL);

        let iv = crypto.randomBytes(12);
        let cipher = crypto.createCipheriv(algorithm, process.env.PASS, iv);

        let enc = Buffer.concat([cipher.update(client.phone, 'utf8'), cipher.final()]);
        let tag = cipher.getAuthTag();

        let crypted = Buffer.concat([iv, enc, tag]).toString('base64');

        client.phone = crypted;
        next();
    }


})

let Client = mongoose.model('Client', ClientSchema);

module.exports = { Client }