var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'),
    fs = require('fs');


//build the REST operations at the base for countries
//this will be accessible from http://127.0.0.1:3000/countries if the default route for / is left unchanged
router.route('/')
    //GET all countries
    .get(function(req, res, next) {
        //retrieve all countries from Monogo
        mongoose.model('Country').find({}, function (err, countries) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/countries folder. We are also setting "countries" to be an accessible variable in our jade view
                    html: function(){
                        res.render('countries/index', {
                              title: 'All Countries',
                              "countries" : countries
                          });
                    },
                    //JSON response will show all countries in JSON format
                    json: function(){
                        res.json(countries);
                    }
                });
              }     
        });
    })

module.exports = router;