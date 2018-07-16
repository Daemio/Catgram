const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const photosRouter = require('./routes/photos');
const commentsRouter = require('./routes/comments');
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/users', usersRouter);
app.use('/photos', photosRouter);
app.use('/comments', commentsRouter);

module.exports = app;
