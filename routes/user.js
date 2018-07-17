const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config').auth;

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

    const user = User.findOne({email: email})
        .then((user) => {
            const correct = bcrypt.compareSync(password, user.password);

            if(!correct) {
                res.status(401).json({message: 'Incorrect password'});

                return;
            }

            const token = jwt.sign({user: user}, secret, {expiresIn: expiresIn});

            res.status(201).json({auth: true, token: token});
        })
        .catch((err) => {
            res.status(404).json({message: 'Not found', error: err});

            return;
        });
});

router.post('/logout', (req, res, next) => {
    res.status(201).json({auth:false, token:null});
});

module.exports = router;