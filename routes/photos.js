const router = require('express').Router();
const Photo = require('../models/photo');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const _ = require('lodash');
const upload = require('../middleware/upload');
const fs = require('fs');

router.post('/', auth, upload.single('photo'), (req, res, next) => {
    if(!req.file) {
        res.status(400).json({message: 'no photo provided'});
        return;
    }

    const photo = new Photo({
        _id: new mongoose.Types.ObjectId(),
        photoPath: req.file.path,
        description: req.body.description,
        date: Date.now(),
        user_id: req.userID
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
    Photo.findById(req.params.id)
        .select('-__v')
        .exec()
        .then((photo) => {
            res.status(200).json(photo);
        })
        .catch((err) => {
            console.log(err);

            res.status(404).json({message: 'Photo not found'});
        });
});

router.patch('/:id', auth, (req, res, next) => {
    const description = req.body.description;
    if(!description) {
        res.status(400).json({message: 'nothing to modify'});
        return;
    }
    Photo.findById(req.params.id)
        .exec()
        .then((photo) => {
            if(photo.user_id == req.userID) {
                Photo.update({_id:req.params.id}, {description:description})
                    .exec()
                    .then((result) => {
                        res.status(200).json({photo: photo, message:'Successfully updated'});
                    });
            } else {
                res.status(403).json({message: 'You can modify only your photos'});
            }
        })
        .catch((err) => {
            console.log(err);

            res.status(404).json({message: 'Photo not found'});
        });
});

router.delete('/:id', auth, (req, res, next) => {
    Photo.findById(req.params.id)
        .exec()
        .then((photo) => {
            if(photo.user_id == req.userID) {
                fs.unlinkSync(photo.photoPath);
                Photo.remove({_id:req.params.id})
                    .exec()
                    .then((result) => {
                        res.status(200).json({photo: photo, message:'Successfully removed'});
                    });
            } else {
                res.status(403).json({message: 'You can delete only your photos'});
            }
        })
        .catch((err) => {
            console.log(err);

            res.status(404).json({message: 'Photo not found'});
        });
});

router.get('/', (req, res, next) => {
    const userID = req.query.userID;
    const offset = +req.query.offset || 0;
    const limit = +req.query.limit || 10;

    Photo.find(userID ? {user_id: userID} : {})
        .skip(offset)
        .limit(limit)
        .exec()
        .then((photos) => {
            res.status(200).json({
                data: photos,
                offset: offset,
                count: photos.length,
                limit: limit
            })
        })
        .catch((err) => {
            res.status(500).json({message: err.message});
        });
});

module.exports = router;
