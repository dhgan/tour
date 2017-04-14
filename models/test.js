var mongoose = require('mongoose');

var testSchema = new mongoose.Schema({
	name: String,
	sex: String
});

testSchema.methods.getSex = function() {
	return this.sex;
};

var Test = mongoose.model('Test', testSchema);
module.exports = Test;