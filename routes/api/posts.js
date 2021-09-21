const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');


//@route  GET api/posts/test
//@decs   test posts route
//@access Public

router.get('/test', (req, res) => res.jsonp({ msg : ' posts Works'}));

//@route  POST api/posts
//@decs   test posts route
//@access Private

router.post('/', 
passport.authenticate('jwt', {session : false}), 
(req, res) =>{
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.name,
        user: req.body.id,
    });

    newPost.save().then(post => res.json(post));
});

module.exports = router;