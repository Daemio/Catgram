const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config').auth;
const _ = require('lodash');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/signup', upload.single('avatar'), (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        avatarPath: req.file.path,
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save()
        .then((doc) => {
            console.log('User created');

            res.status(201).json({user: doc});
        })
        .catch((err) => {
            console.log(err);

            res.status(500).json({message:err.message})
        })
});

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        res.status(400).json({message: "Missing required auth information"});

        return;
    }

    const secret = jwtConfig.tokenSecret;
    const expiresIn = jwtConfig.tokenLifetime;

    User.findOne({email: email})
        .exec()
        .then((user) => {
            const correct = bcrypt.compareSync(password, user.password);

            if(!correct) {
                res.status(400).json({message: 'Incorrect password'});

                return;
            }

            const token = jwt.sign({userID: user._id}, secret, {expiresIn: expiresIn});
            const userInfo = _.pick(user, ['_id', 'name', 'avatar', 'birthday']);

            res.status(200).json({auth: true, user: userInfo, token: token});
        })
        .catch((err) => {
            res.status(404).json({message: 'User not found', error: err});

            return;
        });
});

router.get('/profile/:id', (req, res, next) => {
    User.findById(req.params.id)
        .exec()
        .then((user) => {
            const userInfo = _.pick(user, ['_id', 'name', 'avatarPath']) //not to give full info
            console.log(userInfo);

            res.status(200).json(userInfo);
        })
        .catch((err) => {
            console.log(err);

            res.status(404).json({message: 'User not found'});
        });
});

router.patch('/profile', auth, upload.single('avatar'), (req, res, next) => {
    const userID = req.userID; //проверка не нужна, так как неавторизованный юзер не пройдет сюда
    
    if(!req.file) {
        res.status(400).json({message: 'no photo provided'});
        return;
    }

    const updateOps= {avatarPath: req.file.path};
    User.uptate({_id: userID}, {$set: updateOps})
        .exec()
        .then((user) => {
            console.log(user);

            res.status(200).json({message: "Successfully updated"});
        })
        .catch((err) => {
            console.log(err);

            res.status(500).json({message: err.message});
        });
});

router.post('/logout', (req, res, next) => {
    res.status(201).json({auth:false, token:null});
});

module.exports = router;