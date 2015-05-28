var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Show = new Schema({
  location: { type: String, required: true },
  date: { type: String, required: true },
  modified: { type: Date, default: Date.now }
},
{
  versionKey: false
});

module.exports = mongoose.model('Show', Show);
