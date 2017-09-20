var request = require('request'),
	express = require('express'),
	mongoose = require('mongoose'); //mongo connection

request('http://pastebin.com/raw/943PQQ0n', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
  countryList = body.split("\n");
  String csvString = "";
  for (var i = 0; i < countryList.length; i++){
  	//a little ugly, but no need to complicate a single use function
  	if (i>2 && i<countryList.length-1){
  		console.log(countryList[i]);
  		country = countryList[i].split("   ");
  		var countryName = country[1];
        var countryCode = country[0];
        //var flagURL = getFlagUrl();
        var flagURL = "flag";
        console.log("CountryName " + countryName);
        console.log("CountryCode" + countryCode);
        csvString.append(countryName + "," + countryCode + "\n");

    	mongoose.model('Country').create({
        countryName : countryName,
        countryCode : countryCode,
        flagURL : flagURL
        }, function (err, country) {
              if (err) {
              	//res.send("There was a problem adding the information to the database.");
              }

  		})
        
    } //endif
  } //endfor

});//endRequest
