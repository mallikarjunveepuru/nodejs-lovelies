var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
},
{
  versionKey: false
});

module.exports = mongoose.model('User', User);
