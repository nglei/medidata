var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	isPatient: {type:Boolean, default: true},
	username: {type: String, unique: true},
	email: String,
	password: String,
	name: String,
	data_added: {type: Date, default: Date.now() + 28800000},
	icNo: String,
	birthday: String,
	gender: String,
	nationality: String,
	occupation: String,
	bloodType: String,
	disease: String,
	contactNo: String,
	address: String,
	emergencyName: String,
	emergencyContact: String,
	publickey: String,
	hospital:String
});

const User = module.exports = mongoose.model('User',userSchema);
