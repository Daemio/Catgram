const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config').auth;
const _ = require('lodash');

router.post('/signup', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
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
        res.status(500).json({message: "Missing required auth information"});

        return;
    }

    const secret = jwtConfig.tokenSecret;
    const expiresIn = jwtConfig.tokenLifetime;

    User.findOne({email: email})
        .exec()
        .then((user) => {
            const correct = bcrypt.compareSync(password, user.password);

            if(!correct) {
                res.status(401).json({message: 'Incorrect password'});

                return;
            }

            const token = jwt.sign({userID: user._id}, secret, {expiresIn: expiresIn});
            const userInfo = _.pick(user, ['_id', 'name', 'avatar', 'birthday']);

            res.status(201).json({auth: true, user: userInfo, token: token});
        })
        .catch((err) => {
            res.status(404).json({message: 'Not found', error: err});

            return;
        });
});

router.get('/profile/:id', (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            const userInfo = _.pick(user, ['_id', 'name', 'avatar', 'birthday']) //not to give full info

            res.status(200).json(userInfo);
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