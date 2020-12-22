var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');


//Bring in User Model
let User = require('../models/user');

router.get('/', function(req,res){
	res.render('login');
});

router.post('/', function(req,res,next){
	passport.authenticate('local', {
		successRedirect: '/home',
		failureRedirect: '/login',
    failureFlash: true
	})(req,res,next);
	/*console.log(req.body);
	res.render('homeDash',{data: req.body});*/
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success','You are logout');
  res.redirect('/login');
});

module.exports = router;
