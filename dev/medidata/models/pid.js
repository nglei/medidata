var mongoose = require('mongoose');

//Create a user schema
var pidSchema = new mongoose.Schema({
	prescription: Number
});

const Pid = module.exports = mongoose.model('Presciption', pidSchema);
