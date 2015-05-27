var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Song = new Schema({
  location: { type: String, required: true },
  date: { type: Date, required: true },
  modified: { type: Date, default: Date.now }
},
{
  versionKey: false
});

module.exports = mongoose.model('Song', Song);
