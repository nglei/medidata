var express = require('express');
var bodyParser = require('body-parser');
var router = express();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var config = require('./config/database');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var router = express.Router();

//Connect to database
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


/*let User = require('./models/user');
let newUser = new User({
  isPatient: false,
	username: 'drlau',
	email: 'drlau@gmail.com',
	password: 'doctor1234',
	name: 'Dr Lau Ying Yew'
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
          return;
        }else{
          console.log('successfully added doctor');
        }
      });
  });
});*/

router.use(cookieParser('keyboard'));
//Express session middleware
router.use(session({
  secret: 'keyboard',
  resave: false,
  saveUninitialized: true
}));

//Express messages middleware
router.use(require('connect-flash')());
router.use(function (req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator middleware
router.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport config
require('./config/passport')(passport);
//Passport middleware
router.use(passport.initialize());
router.use(passport.session());

router.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

router.set('view engine', 'ejs');

router.use(express.static('public'));
/*router.use('/css', express.static('css'));
router.use('/js', express.static('js'));
router.use('/images', express.static('images'));
router.use('/vendor', express.static('vendor'));
router.use('/fonts', express.static('fonts'));*/


// parse routerlication/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse routerlication/json
router.use(bodyParser.json());


//sign up
let signup = require('./controllers/signupController');
router.use('/signup',signup);

//login
let login = require('./controllers/loginController');
router.use('/login',login);

router.get('/profile/:name', function(req,res){
	res.render('profile', {person: req.params.name});
});

router.get('/addMedicalRecord', function(req,res){
	res.sendFile(__dirname + '/addMedicalRecord.html');
});

router.get('/addPrescription', function(req,res){
	res.sendFile(__dirname + '/addPrescription.html');
});

router.post('/addPrescription', function(req,res){
	console.log(req.body);
	res.sendFile(__dirname + '/addPrescription.html');
});

router.get('/contact', function(req,res){
	res.sendFile(__dirname + '/contact.html');
});

router.get('/home', function(req,res){
	res.render('home');
});

router.get('/homeDash', function(req,res){
	res.render('homeDash');
});

router.get('/medicalRecordForD', function(req,res){
	res.sendFile(__dirname + '/medicalRecordForD.html');
});

router.get('/medicalRecord', function(req,res){
	res.sendFile(__dirname + '/medicalRecord.html');
});

router.get('/prescription', function(req,res){
	res.sendFile(__dirname + '/prescription.html');
});

router.get('/prescriptionForD', function(req,res){
	res.sendFile(__dirname + '/prescriptionForD.html');
});

router.get('/viewPrescription', function(req,res){
	res.sendFile(__dirname + '/viewPrescription.html');
});

router.get('/viewMedicalRecord', function(req,res){
	res.sendFile(__dirname + '/viewMedicalRecord.html');
});

module.exports = router;
//router.listen(3000);
