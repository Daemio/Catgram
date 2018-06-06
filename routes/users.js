const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.status(200).json({message: 'Here will be list of users'});
});

router.get('/:id', (req, res, next) => {
    res.status(200).json({message: `Here information of user with id=${req.params.id} will be displayed`});
});

module.exports = router;