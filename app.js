const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const photosRouter = require('./routes/photos');
const commentsRouter = require('./routes/comments');

app.use('/users', usersRouter);
app.use('/photos', photosRouter);
app.use('/comments', commentsRouter);

module.exports = app;
