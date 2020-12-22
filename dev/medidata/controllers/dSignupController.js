var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const passport = require('passport');
var NodeRSA = require('node-rsa');
var key = NodeRSA({b:512});

//Bring in User Model
let User = require('../models/user');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req,res){
	res.render('dSignup');
});

router.post('/', function(req,res){

	var publicKeyDer = key.exportKey('pkcs8-public-der');
	var publickey= Buffer.from(publicKeyDer, "binary").toString("base64");
	var privateKeyDer = key.exportKey('pkcs1-der');
	var privatekey = Buffer.from(privateKeyDer, "binary").toString("base64");
	console.log('\nPUBLIC:');
	console.log(publickey);
	console.log('\nPRIVATE:');
	console.log(privatekey);
	var privatekeyFormat = privatekey.toString('base64').match(/.{0,64}/g).join('\n');

	var username = req.body.username;
	var password = req.body.password;
	var cPassword = req.body.cPassword;
	var email = req.body.email;
	var name = req.body.name;
  var hospital = req.body.hospital;
	var isPatient = false;

	var newUser = new User({
		isPatient: isPatient,
		username: username,
		email: email,
		password: password,
		name: name,
    hospital: hospital,
    publickey: publickey
	});

	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
				if(err){
					console.log(err);
				}
				newUser.password = hash;
				newUser.save(function(err){
					if(err){
						console.log(err);
						res.redirect('/dSignup');
						return;
					}else{
						/*req.flash('success', 'Registration successfully');
						res.locals.message = req.flash();*/
						req.flash('success',"Please save your private key safely.");
						req.flash('success',"Your Private Key:\n" + privatekeyFormat);
						res.redirect('/login');
					}
				});
		});
	});

	/*var newPatient = Patient(req.body).save(function(err,data){
		if (err) throw err;
	});
	res.render('login');*/
});

module.exports = router;
