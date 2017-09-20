var mongoose = require('mongoose');  
var countrySchema = new mongoose.Schema({  
  countryName: String,
  countryCode: String,
  flagURL: String
});
mongoose.model('Country', countrySchema);