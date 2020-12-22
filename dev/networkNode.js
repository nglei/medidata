const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');

const medidata = new Blockchain();


var NodeRSA = require('node-rsa');

const User = require('./medidata/models/user');
const Mid = require('./medidata/models/mid');
const Pid = require('./medidata/models/pid');

var path = require('path');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var config = require(path.join(__dirname, '/medidata/config/database'));
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');


var midCounter = 0;
var pidCounter = 0;
//connect to mongoDB
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//set ejs view directory
app.set('views', path.join(__dirname, '/medidata/views'));
app.set('view engine', 'ejs');

app.use(cookieParser('keyboard cat'));
//Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }
}));

//Express messages middleware
app.use(flash());
app.use(function (req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator middleware
app.use(expressValidator({
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
require(path.join(__dirname, '/medidata/config/passport'))(passport);
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//export all the css, js file
app.use(express.static(__dirname + '/medidata/public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// get entire blockchain
app.get('/blockchain', function (req, res) {
  res.send(medidata);
});


// create a new transaction
app.post('/transaction', function(req, res) {
	const newTransaction = req.body;
	const blockIndex = medidata.addTransactionToPendingTransactions(newTransaction);
  if(blockIndex == null){
    res.json({note: `This transaction is Invalid.`});
  }else{
	res.json({ note: `Transaction will be added in block ${blockIndex}.` });
}
});


// broadcast transaction
app.post('/transaction/broadcast', function(req, res) {
  var newTransaction ={};
  if(req.body.type === "medical"){
	newTransaction = medidata.createNewRecordTransaction(req.body.hospital,req.body.mID, req.body.title, req.body.admission, req.body.todayDate, req.body.doctorIncharge, req.body.discharge, req.body.description, req.body.notes, req.body.pPrivatekey, req.body.pPublicKey, req.body.dPublicKey,req.body.dPrivatekey);
  transactionAdded = medidata.addTransactionToPendingTransactions(newTransaction);
}else if(req.body.type === "prescription"){
  newTransaction = medidata.createNewPrescriptionTransaction(req.body.hospital,req.body.pID, req.body.pTitle, req.body.ptodayDate, req.body.physician, req.body.pDescription, req.body.pNotes, req.body.pPrivatekey, req.body.pPublicKey, req.body.dPublicKey,req.body.dPrivatekey);
  transactionAdded = medidata.addTransactionToPendingTransactions(newTransaction);
}else{
  newTransaction = medidata.createNewTransaction(req.body.type,req.body.amount, req.body.sender, req.body.recipient);
  transactionAdded = medidata.addTransactionToPendingTransactions(newTransaction);
}




	const requestPromises = [];
	medidata.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		res.json({ note: 'Transaction created and broadcast successfully.' });
	});
});


// mine a block
app.get('/mine', function(req, res) {
	const lastBlock = medidata.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions: medidata.pendingTransactions,
		index: lastBlock['index'] + 1
	};
	const nonce = medidata.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = medidata.hashBlock(previousBlockHash, currentBlockData, nonce);
	const newBlock = medidata.createNewBlock(nonce, previousBlockHash, blockHash);

	const requestPromises = [];
	medidata.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		const requestOptions = {
			uri: medidata.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
        type: "mine",
				amount: 12.5,
				sender: "00",
				recipient: nodeAddress
			},
			json: true
		};

		return rp(requestOptions);
	})
	.then(data => {
    rp(medidata.currentNodeUrl + '/homeDash')
    		.then(function (htmlString) {
        	// Process html...
        	res.redirect('/homeDash');
    	})
	    .catch(function (err) {
	        // Crawling failed...
	    });

	});
});


// receive new block
app.post('/receive-new-block', function(req, res) {
	const newBlock = req.body.newBlock;
	const lastBlock = medidata.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash;
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctHash && correctIndex) {
		medidata.chain.push(newBlock);
		medidata.pendingTransactions = [];
		res.json({
			note: 'New block received and accepted.',
			newBlock: newBlock
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock
		});
	}
});


// register a node and broadcast it the network
app.post('/register-and-broadcast-node', function(req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	if (medidata.networkNodes.indexOf(newNodeUrl) == -1) medidata.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	medidata.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

	Promise.all(regNodesPromises)
	.then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl + '/register-nodes-bulk',
			method: 'POST',
			body: { allNetworkNodes: [ ...medidata.networkNodes, medidata.currentNodeUrl ] },
			json: true
		};

		return rp(bulkRegisterOptions);
	})
	.then(data => {
		res.json({ note: 'New node registered with network successfully.' });
	});
});


// register a node with the network
app.post('/register-node', function(req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = medidata.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = medidata.currentNodeUrl !== newNodeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode) medidata.networkNodes.push(newNodeUrl);
	res.json({ note: 'New node registered successfully.' });
});


// register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res) {
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = medidata.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = medidata.currentNodeUrl !== networkNodeUrl;
		if (nodeNotAlreadyPresent && notCurrentNode) medidata.networkNodes.push(networkNodeUrl);
	});

	res.json({ note: 'Bulk registration successful.' });
});


// consensus
app.get('/consensus', function(req, res) {
	const requestPromises = [];
	medidata.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(blockchains => {
		const currentChainLength = medidata.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null;

		blockchains.forEach(blockchain => {
			if (blockchain.chain.length > maxChainLength) {
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingTransactions = blockchain.pendingTransactions;
			};
		});


		if (!newLongestChain || (newLongestChain && !medidata.chainIsValid(newLongestChain))) {
			res.json({
				note: 'Current chain has not been replaced.',
				chain: medidata.chain
			});
		}
		else {
			medidata.chain = newLongestChain;
			medidata.pendingTransactions = newPendingTransactions;
			res.json({
				note: 'This chain has been replaced.',
				chain: medidata.chain
			});
		}
	});
});


// get block by blockHash
app.get('/block/:blockHash', function(req, res) {
	const blockHash = req.params.blockHash;
	const correctBlock = medidata.getBlock(blockHash);
	res.json({
		block: correctBlock
	});
});


// get transaction by transactionId
app.get('/transaction/:transactionId', function(req, res) {
	const transactionId = req.params.transactionId;
  const publickey = req.query.publickey;
	const trasactionData = medidata.getTransaction(transactionId,publickey);
	res.json({
		transaction: trasactionData.transaction,
		block: trasactionData.block,
    data: trasactionData.data
	});
});

// get medical record list by patient
app.get('/getMedicalRecord/', function(req, res) {
	const address = req.query.address;
	const addressData = medidata.getPatientRecord(address);
  const allAddressData = addressData;
    res.json({
  		addressData: allAddressData
  	});
});



// get prescription lsit by patient
app.get('/getPrescription/', function(req, res) {
	const address = req.query.address;
	const addressData = medidata.getPatientPrescription(address);
	res.json({
		addressData: addressData
	});
});


// block explorer
app.get('/block-explorer', function(req, res) {
	res.sendFile('./block-explorer/index.html', { root: __dirname });
});



//get date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
if(dd<10)
{
    dd='0'+dd;
}

if(mm<10)
{
    mm='0'+mm;
}


//login
var login = require('./medidata/controllers/loginController');
app.use('/login',login);

//sign up
var signup = require('./medidata/controllers/signupController');
app.use('/signup',signup);

//doctor sign up
var dSignup = require('./medidata/controllers/dSignupController');
app.use('/dSignup',dSignup);

//middleware check user is patient
var isPatient = function(req, res, next){
	if(req.user && req.user.isPatient === true){
		return next();
	}else{
		res.redirect('/homeDash');
	}
};

//middleware check if user logged in
var logged = function(req, res, next) {
    if (req.isAuthenticated()) {
         return next();
       }
    res.redirect('/login');
};
//user homepage
app.get('/home',logged, isPatient, function(req,res){
  var age = parseInt(yyyy) - parseInt(req.user.birthday.substring(6,10));
  req.user.age = age;
	res.render('home', {user:req.user});
});

//doctor homepage
app.get('/homeDash',logged, function(req,res){
	res.render('homeDash',{user:req.user});
});

// enter public key to view patient medical Record
app.post('/homeDash', function(req,res){

  var p = req.body.publickey;
  if(req.body.type === "medical" && req.body.publickey != ""){
    res.redirect("/medicalRecord/?id=" + p);
	   //res.render('medicalRecordForDoctor',{data: req.body});
   }else if(req.body.type === "prescription" && req.body.publickey != ""){
     res.redirect("/prescription/?id=" + p);
 	   //res.render('medicalRecordForDoctor',{data: req.body});
    }
   else{
     res.redirect('/homeDash');
   }
});

//doctor add medical record
app.get('/addRecord', function(req,res){
  Mid.countDocuments({}, function( err, count){
    medicalID = count;
    today = dd+'/'+mm+'/'+yyyy;
  	res.render('addMedicalRecord',{user:req.user, date:today, mid: medicalID + 1,id:req.query.id});
  });

});

app.post('/addRecord', function(req,res,next){
  var mid = new Mid({
    medicalRecord:1
  });
  mid.save(function(err,mid){
    if (err) return console.error(err);
  });
  req.body.type = "medical";
  req.body.pPublicKey = req.query.id;
  req.body.dPublicKey = req.user.publickey;
  req.body.hospital = req.user.hospital;

  if(req.body.admission === ""){
    req.body.admission = "-";
  }
  if(req.body.discharge === ""){
    req.body.discharge = "-";
  }

  rp({
        method: 'POST',
        uri: medidata.currentNodeUrl +'/transaction/broadcast',
        body: req.body,
        simple: false,
        json: true // Automatically stringifies the body to JSON
        }).then(function (parsedBody) {

                res.redirect('/mine');
                // POST succeeded...
            })
            .catch(function (err) {

                return err+'failed to post data.';
                // POST failed...
        });
});

// get add prescription
app.get('/addPrescription', function(req,res){
  Pid.countDocuments({}, function( err, count){
    today = dd+'/'+mm+'/'+yyyy;
  	res.render('addPrescription',{user:req.user, date:today, pid:count+1,id:req.query.id });
  });

});

app.post('/addPrescription', function(req,res,next){
  var pid = new Pid({
    prescription:1
  });
  pid.save(function(err,pid){
    if (err) return console.error(err);
  });
  req.body.type = "prescription";
  req.body.pPublicKey = req.query.id;
  req.body.dPublicKey = req.user.publickey;
  req.body.hospital = req.user.hospital;

  rp({
        method: 'POST',
        uri: medidata.currentNodeUrl +'/transaction/broadcast',
        body: req.body,
        simple: false,
        json: true // Automatically stringifies the body to JSON
        }).then(function (parsedBody) {

                res.redirect('/mine');

                // POST succeeded...
            })
            .catch(function (err) {

                return err+'failed to post data.';
                // POST failed...
        });
});

//enter key page to view medical Record
app.get('/enterToViewRecord', function(req,res){
	res.render("enterToViewRecord",{user:req.user});
});

app.post('/enterToViewRecord', function(req,res){
  var p = req.body.publickey;
  if(req.body.type === "medical" && req.body.publickey != ""){
    res.redirect("/medicalRecord/?id=" + p);
  }else{
    res.redirect("/enterToViewRecord");
  }
});

// medical record list
app.get('/medicalRecord', function(req,res){
 if(req.query.id == null){
    res.redirect("/enterToViewRecord");
  }else{
	res.render('medicalRecord',{data: req.query.id, user:req.user});
}
});

app.post('/medicalRecord', function(req,res){
  var p = req.body.publickey;
  if(req.body.type === "medical" && req.body.publickey != ""){
    res.redirect("/medicalRecord/?id=" + p);
   }
   else{
     res.redirect('/medicalRecord');
   }
});

app.get('/enterToViewPrescription', function(req,res){
	res.render("enterToViewPrescription",{user:req.user});
});

// get prescription list
app.get('/prescription/?', function(req,res){

  if(req.query.id == null){
    res.redirect("/enterToViewPrescription");
  }else{
	res.render("prescription",{data: req.query.id, user:req.user});
}
});


app.post('/enterToViewPrescription', function(req,res){
  var p = req.body.publickey;
  if(req.body.type === "prescription" && req.body.publickey != ""){
    res.redirect("/prescription/?id=" + p);
   }
   else{
     res.redirect('/enterToViewPrescription');
   }
});

//contact homepage
app.get('/contact', function(req,res){
	res.render('contact',{user:req.user});
});


//app.listen(3000);

app.listen(port, function() {
	console.log(`Listening on port ${port}...`);
});
