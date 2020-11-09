const {Router} = require('express');
const Link = require('../models/Link');
const config = require('config');
const shortId = require('shortid');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl');
        const {from} = req.body;

        const code = shortId.generate();

        const existsLink = await Link.findOne({ from });

        if (existsLink) {
            return res.status(200).json({ link: existsLink })
        }

        const to = baseUrl + '/t/' + code

        const link = new Link({
            code, from, to, owner: req.user.userId
        })

        await link.save();
        res.status(201).json({ link })

    }catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
});

router.get('/', auth, async (req, res) => {
    console.log(req)
    try {
        const links = await Link.find({ owner: req.user.userId })
        res.json(links);
    }catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id) // ??
        res.json(link);
    }catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
});

module.exports = router;