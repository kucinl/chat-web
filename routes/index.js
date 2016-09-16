var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  /*if (!req.account) {
    res.render('login', {
      title: 'Kucin'
      , baseUrl: 'http://localhost:3000/#/login'
    });
  } else {*/
  res.render('index', {
    title: 'Kucin'
    , baseUrl: 'http://localhost:3000/'
  });
  /*  }*/

});

router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'login'
  });
});

module.exports = router;