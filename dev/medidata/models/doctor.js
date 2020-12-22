var mongoose = require('mongoose');

//Create a user schema
var doctorSchema = new mongoose.Schema({
	user_type: String,
	username: String,
	email: String,
	password: String,
	name: String,
	data_added: {type: Date, default: Date.now() + 28800000}
});

const Doctor = module.exports = mongoose.model('Doctor', doctorSchema);
