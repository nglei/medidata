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
	res.render('signup');
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
	var icNo = req.body.icNo;
	var birthday = req.body.birthday;
	var gender = req.body.gender;
	var nationality = req.body.nationality;
	var occupation = req.body.occupation;
	var bloodType = req.body.bloodType;
	var disease = req.body.disease;
	if(disease === ""){
		disease = "-";
	}
	var contactNo = req.body.contactNo;
	var address = req.body.address;
	var emergencyName = req.body.emergencyName;
	var emergencyContact = req.body.emergencyContact;
	var isPatient = true;

	var newUser = new User({
		isPatient: isPatient,
		username: username,
		email: email,
		password: password,
		name: name,
		icNo: icNo,
		birthday: birthday,
		gender: gender,
		nationality: nationality,
		occupation: occupation,
		bloodType: bloodType,
		disease: disease,
		contactNo: contactNo,
		address: address,
		emergencyName: emergencyName,
		emergencyContact: emergencyContact,
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
						res.redirect('/signup');
						return;
					}else{
						
						req.flash('success',"Please save your private key safely. \nYour Private Key:\n" + privatekeyFormat);
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
