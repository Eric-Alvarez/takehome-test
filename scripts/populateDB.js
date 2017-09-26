var request = require('request'),
	express = require('express'),
  fs = require('fs');
	mongoose = require('mongoose'); //mongo connection

request('http://pastebin.com/raw/943PQQ0n', function (error, response, body) {
  mongoose.model('Country').remove({}, function(err) { 
   console.log('collection removed') 
});
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  countryList = body.split("\n");
  var csvString = "";
  for (var i = 0; i < countryList.length; i++){
  	//not the most robust solution, but no need to complicate a one-use function
  	if (i>2 && i<countryList.length-1){
  		country = countryList[i].split("   ");
  		var countryName = country[1];
      var countryCode = country[0];
      csvString +=  '"' +  countryName.replace(/(\r\n|\n|\r)/gm,"") + '",' + countryCode + "\n";
        mongoose.model('Country').create({
        countryName : countryName,
        countryCode : countryCode
        }, function (err, country) {
              if (err) {
              	console.log("There was a problem adding the information to the database.");
              }
  			})
        
    } //endif
  } //endfor
  var data = fs.writeFile('public/files/countries.txt', csvString, 'utf8', function(err){
    if (err){
      console.log(err);
        }
      });

});//endRequest
