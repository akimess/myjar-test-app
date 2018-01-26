## Usage
1) Install node dependencies: **npm install**
2) To start a development build: **npm start**

The last command will automatically open the browser with the needed address (localhost:3000).

## Backend

**Language:** NodeJS. 

**Framework:** Express.

**Database:** MongoDB.

**Why Express?**

I choose Express so I could build a more readable code with routing and understandable file structure. Express speed up the process of writing the backend significantly by removing the need to write repetitive code.

**Why MongoDB?**

In the specification it said that the payload will have 10 fields, in which only two fields are specified, the rest can have different names. With that in mind, it is easier and more logical to store them as documents, which MongoDB is used for. Mongoose MongoDB library for NodeJS allowed to write a database connection that could automatically perform tasks before creating and extracting documents, for example encrypt and decrypt phone number.

**Phone number validation and Encryption/Decryption**

I used “google-libphonenumber” library for phone number validation. It allowed me to not only to validate if the phone number is valid for Great Britain, but also parse it to a correct format.

For encryption/decryption I used built-in NodeJS module “crypto”, algorithm “aes-256-gcm”. AES 256 can only be broken by brute-force ( or if the passphrase is easily accessible ). How fast it can be broken depends on the passphrase strength. GCM mode is best suited if you want confidentiality and integrity. Because the specification stated that the phone number should be stored in a secure encrypted way that meant confidentiality, but we need to also show the last 4 number of the phone number in our “GET” requests, which meant we needed integrity.

**Structure**
```
├───config
│       config.js
│       config.json
├───controllers
│       clientController.js
├───db
│       mongoose.js
├───models
│       client.js
└───routes
        clients.js
```

## API
**Routes**
`GET /clients` - will return all clients that are stored currently in the database.

Response:
```javascript
{
    "success": Boolean,
    "data": {
        "_id": ObjectID,
        "email": String
    }
}
```

`GET /clients?search={value}` - filter specific client emails by keyword.

Response (**NB!** Response varies depending on what field names you provided):
```javascript
{
    "success": Boolean,
    "data": {
        "_id": ObjectID,
        "email": String
    }
}
```
`GET /clients/:id` - will return specified client full information.

Response:
```javascript
{
    "success": Boolean,
    "data": {
        "email": String,
        "phone": String,
        "field1": String,
        "field2": String,
        "field3": String,
        "field4": String,
        "field5": String,
        "field6": String,
        "field7": String,
        "field8": String
    }
}
```

`POST /clients` - will upload new client to the database.

Body example:
```javascript
{
    "email": String,
    "phone": String,
    "field1": String,
    "field2": String,
    "field3": String,
    "field4": String,
    "field5": String,
    "field6": String,
    "field7": String,
    "field8": String
}
```
There should be 10 fields in total. Email and Phone fields are required, all other fields can be renamed. **NB!** Email and Phone are validated.

Response:

*If successful*
```javascript
{
    "success": true,
    "message": String
}
```

*If unsuccessful*
```javascript
{
    "success": false,
    "message": String,
    "errors": {
        "email": String,
        "phone": String
    }
}
```

## Frontend

**Language:** JavaScript.

**Library**: React.

**React Tools**: Material-UI (https://material-ui-next.com/).

**Why React?**

React was chosen so I could create a beatiful design with understandable code in a short period of time. I like the design of Google's Material UI, so I choosen the tool specified above to create an intuitive and beautiful design.

**Structure**
```
│   App.js
│   index.js
├───component
│       ClientInfo.js
│       NewClient.js
└───styles
        App.css
        ClientInfo.css
        index.css
        NewClient.css
```

## Workflow
**Upload new client**
1) Click "New Client" button.
2) There you can chage field names and field values.
3) Once ready, click save.

If there will be any errors, it will show in the form.

**Search clients**
1) On the right top corner you will see the search field. Enter the keyword there.
2) Once the keyword is entered either press Enter key or click on the search icon.
3) If it found a client with the specified keyword in its email, then it will be displayed. If not, the table will be blank.
4) To display all clients again, simply remove the keyword in the search field and hit the Enter key.

**View client info**
1) On the dashboard, on the right side accross client email you will find the eye icon.
2) Click it to view clients info.

## Notes
* I used mLab to deploy a mongodb database.
* You can run a production build of the front end by executing commands *npm run build* and *npm run server*.
