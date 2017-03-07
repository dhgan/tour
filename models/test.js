var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
	name: String,
	sex: String
});

testSchema.methods.getSex = function() {
	return this.sex;
};

var Test = mongoose.model('Test', testSchema);
module.exports = Test;