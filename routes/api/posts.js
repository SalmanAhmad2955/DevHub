const express = require('express');
const router = express.Router();

//@route  GET api/posts/test
//@decs   test posts route
//@access Public

router.get('/test', (req, res) => res.jsonp({ msg : ' posts Works'}));

module.exports = router;