const router = require('express').Router();

router.post('/', (req, res, next) => {
    res.status(201).json({message: `Comment was created`});
});

router.get('/:id', (req, res, next) => {
    res.status(200).json({message: `Here information of comment with id=${req.params.id} will be displayed fsdfsfs`});
});

router.patch('/:id', (req, res, next) => {
    res.status(200).json({message: `Comment with id=${req.params.id} was modified`});
});

router.delete('/:id', (req, res, next) => {
    res.status(200).json({message: `Comment with id=${req.params.id} was deleted`});
});

module.exports = router;