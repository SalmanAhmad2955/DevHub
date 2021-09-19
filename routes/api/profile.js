const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load profile model
const Profile = require('../../models/Profile');

// load user model
const User = require('../../models/User');

//@route  GET api/Profile/test
//@decs   test Profile route
//@access Public

router.get('/test', (req, res) => res.jsonp({ msg : ' Profile Works'}));

//@route  GET api/Profile
//@decs   get current user profile
//@access Private

router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    const errors= {};

    Profile.findOne({
        user: req.user.id
    })
    .then(profile => {
        if(!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }
        res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

//@route  POST api/Profile
//@decs   Creat or edit User Profile
//@access Private

router.post(
    '/', 
    passport.authenticate('jwt', { session: false}),
    (req, res) => {
    // get field
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.webside) profileFields.handle = req.body.webside;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills = Spilt into array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills= req.body.skills.split(',');
    }

    //social 
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id})
    .then( profile => {
        if(profile){
            //update
            Profile.findByIdAndUpdate(
                { user: req.user.id}, 
                { $set: profileFields}, 
                { new: true}
                )
                .then( profile => res.json(profile));
        } else {

            // check if handel exists
            Profile.findOne(
                { handle: profileFields.handle }
                )
            .then(profile => {
                if(profile) {
                errors.handle = ' That handle already exists';
                res.status(400).json(errors);
                }
            // save Profile
            new Profile(profileFields.save()
            .then(profile => res.json(profile)));
            });
        }
    });
    }
);

module.exports = router;