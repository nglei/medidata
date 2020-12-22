var mongoose = require('mongoose');

//Create a user schema
var midSchema = new mongoose.Schema({
	medicalRecord: Number
});

const Mid = module.exports = mongoose.model('Record', midSchema);
