var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Song = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  modified: { type: Date, default: Date.now }
},
{
  versionKey: false 
});

module.exports = mongoose.model('Song', Song);
