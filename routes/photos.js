const router = require('express').Router();
const Photo = require('../models/photo');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

router.post('/', auth, (req, res, next) => {
    const photo = new Photo({
        _id: new mongoose.Types.ObjectId(),
        uri: req.body.uri,
        description: req.body.description,
        date: Date.now(),
        user_id: req.userInfo._id
    });

    photo.save()
        .then((doc) => {
            console.log(doc);

            res.status(201).json(doc);
        })
        .catch((err) => {
            console.log(err);

            res.status(500).json({message: err.message});
        });
});

router.get('/:id', (req, res, next) => {
    res.status(200).json({message: `Here information of photo with id=${req.params.id} will be displayed`});
});

router.patch('/:id', (req, res, next) => {
    res.status(200).json({message: `Photo with id=${req.params.id} was modified`});
});

router.delete('/:id', (req, res, next) => {
    res.status(200).json({message: `Photo with id=${req.params.id} was deleted`});
});

module.exports = router;
