const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');
const NodeRSA = require('node-rsa')


function Blockchain() {
	this.chain = [];
	this.pendingTransactions = [];

	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];

	this.createNewBlock(100, '0', '0');
};


Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash
	};

	this.pendingTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
};


Blockchain.prototype.getLastBlock = function() {
	return this.chain[this.chain.length - 1];
};


Blockchain.prototype.createNewTransaction = function(type,amount, sender, recipient) {

	const newTransaction = {
		type: type,
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;
};

Blockchain.prototype.createNewRecordTransaction = function(hospital,mID, title, admission, todayDate, doctorIncharge, discharge, description, notes,pPrivatekey,pPublicKey,dPublicKey,dPrivatekey ) {

	const medical = {
		hospital:hospital,
		admission: admission,
		doctorIncharge: doctorIncharge,
		discharge: discharge,
		description: description,
		notes: notes
	};

	var prefix1 = '-----BEGIN RSA PRIVATE KEY-----\n';
	var postfix1 = '-----END RSA PRIVATE KEY-----';
	var pripemText = prefix1 + pPrivatekey.toString('base64').match(/.{0,64}/g).join('\n') + postfix1;
	var doctorpemText = prefix1 + dPrivatekey.toString('base64').match(/.{0,64}/g).join('\n') + postfix1;
	const key = new NodeRSA();
	const key2 = new NodeRSA();
	key.importKey(pripemText, 'pkcs1-pem');
	key2.importKey(doctorpemText, 'pkcs1-pem');

	const encrypted = key.encryptPrivate(JSON.stringify(medical), 'base64');
	const encryptedHash = sha256(encrypted);
	const signature = key2.sign(encryptedHash,'hex');

	var pubKey = pPublicKey.split(' ').join('+');
	const newTransaction = {
		record: "medical",
		mID: mID,
		title: title,
		date: todayDate,
		data: encrypted,
		doctorIncharge: dPublicKey,
		patient: pubKey,
		signature: signature,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;
};

Blockchain.prototype.createNewPrescriptionTransaction = function(hospital,pID, pTitle, ptodayDate, physician, pDescription, pNotes,pPrivatekey,pPublicKey,dPublicKey,dPrivatekey ) {
	const prescription = {
		hospital: hospital,
		physician: physician,
		description: pDescription,
		notes: pNotes
	};

	var prefix1 = '-----BEGIN RSA PRIVATE KEY-----\n';
	var postfix1 = '-----END RSA PRIVATE KEY-----';
	var pripemText = prefix1 + pPrivatekey.toString('base64').match(/.{0,64}/g).join('\n') + postfix1;
	var doctorpemText = prefix1 + dPrivatekey.toString('base64').match(/.{0,64}/g).join('\n') + postfix1;

	const key = new NodeRSA();
	const key2 = new NodeRSA();
	key.importKey(pripemText, 'pkcs1-pem');
	key2.importKey(doctorpemText, 'pkcs1-pem');

	const encrypted = key.encryptPrivate(JSON.stringify(prescription), 'base64');
	const encryptedHash = sha256(encrypted);
	const signature = key2.sign(encryptedHash,'hex');


	var pubKey = pPublicKey.split(' ').join('+');
	const newTransaction = {
		record: "prescription",
		pID: pID,
		title: pTitle,
		date: ptodayDate,
		data: encrypted,
		physician: dPublicKey,
		patient: pubKey,
		signature:signature,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
	var validation = this.validTransaction(transactionObj);
	if (validation){
		this.pendingTransactions.push(transactionObj);
		return this.getLastBlock()['index'] + 1;
	}else{
		return null;
	}

};

Blockchain.prototype.validTransaction = function(transactionObj){
	var key = new NodeRSA();
	var prefix = '-----BEGIN PUBLIC KEY-----\n';
	var postfix = '-----END PUBLIC KEY-----';

	 if(transactionObj.record === "medical"){
		 var signature = transactionObj.signature;
		 var publickey = transactionObj.doctorIncharge;
		 var dataHash = sha256(transactionObj.data);
		 var pemText = prefix + publickey.toString('base64').match(/.{0,64}/g).join('\n') + postfix;
     key.importKey(pemText, 'pkcs8-public-pem');
		 var verification = key.verify(dataHash, signature, 'utf8','hex');
		 if(verification){
			 return true;
		 }else{
			 return false;
		 }
	 }else if(transactionObj.record === "prescription"){
		 var signature = transactionObj.signature;
		 var publickey = transactionObj.physician;
		 var dataHash = sha256(transactionObj.data);
		 var pemText = prefix + publickey.toString('base64').match(/.{0,64}/g).join('\n') + postfix;
		 key.importKey(pemText, 'pkcs8-public-pem');
		 var verification = key.verify(dataHash, signature, 'utf8','hex');
		 if(verification){
			 return true;
		 }else{
			 return false;
		 }
	 }else if(transactionObj.type === "mine"){
		 return true;
	 }else{
		 return false;
	 }
};


Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};


Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 4) !== '0000') {
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}

	return nonce;
};



Blockchain.prototype.chainIsValid = function(blockchain) {
	let validChain = true;

	for (var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
		if (blockHash.substring(0, 4) !== '0000') validChain = false;
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
	};

	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

	return validChain;
};


Blockchain.prototype.getBlock = function(blockHash) {
	let correctBlock = null;
	this.chain.forEach(block => {
		if (block.hash === blockHash) correctBlock = block;
	});
	return correctBlock;
};


Blockchain.prototype.getTransaction = function(transactionId,publickey) {
	let correctTransaction = null;
	let correctBlock = null;
	let data = null;

	var prefix = '-----BEGIN PUBLIC KEY-----\n';
	var postfix = '-----END PUBLIC KEY-----';
	publickey = publickey.split(' ').join('+');

	var pemText = prefix + publickey.toString('base64').match(/.{0,64}/g).join('\n') + postfix;

	var key = new NodeRSA();
	key.importKey(pemText, 'pkcs8-public-pem');

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				const dataToDecrypt = transaction.data;
				const decryptedString = key.decryptPublic(dataToDecrypt, 'utf8');
				
				data = JSON.parse(decryptedString);
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock,
		data: data
	};
};


Blockchain.prototype.getPatientRecord = function(address) {
	var formatAddress = address.split(' ').join('+');
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.patient === formatAddress && transaction.record === 'medical') {
				addressTransactions.push(transaction);
			};
		});
	});
	return {
		addressTransactions: addressTransactions,
	};
};

Blockchain.prototype.getPatientPrescription = function(address) {
	var formatAddress = address.split(' ').join('+');
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.patient === formatAddress && transaction.record === "prescription") {
				addressTransactions.push(transaction);
			};
		});
	});
	return {
		addressTransactions: addressTransactions,
	};
};





module.exports = Blockchain;
