const router = require('express').Router();

router.post('/', (req, res, next) => {
    res.status(201).json({message: `Photo was created`});
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