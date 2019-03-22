var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'About the Ciphers'});
});
router.get('/ciphers', function(req, res, next) {
  res.render('index', { title: 'The ciphers Route' });
});

router.get('/ciphers/caesar', function(req, res, next) {
  res.render('index', { title: 'The ceasar Route' });
});



router.get('/ciphers/substitution', function(req, res, next) {
  res.render('index', { title: 'The substitution Route' });
});



router.get('/ciphers/morse', function(req, res, next) {
  res.render('index', { title: 'The morse Route' });
});



module.exports = router;
