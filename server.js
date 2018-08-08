const app = require('./app');
const http = require('http');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const dbConfig = require('./config').db;
const fs = require('fs');
const uploads = './uploads';

if (!fs.existsSync(uploads)){
    fs.mkdirSync(uploads);
}

mongoose.connect('mongodb://' + dbConfig.user +
    ':' + dbConfig.password + '@' + dbConfig.host);

mongoose.connection.once('open', () => {
    console.log('Connected to db');
});


http
    .createServer(app)
    .listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
