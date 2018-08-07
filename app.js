const express = require('express');
const app = express();
const userRouter = require('./routes/user');
const photosRouter = require('./routes/photos');
const commentsRouter = require('./routes/comments');
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({limit:'5mb', extended: true}));
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/photos', photosRouter);
app.use('/comments', commentsRouter);

module.exports = app;
