var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

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
                              title: 'All my Countries',
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
    //POST a new country
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var countryName = req.body.countryName;
        var countryCode = req.body.countryCode;
        var flagURL = req.body.flagURL;
        //call the create function for our database
        mongoose.model('Country').create({
            countryName : countryName,
            countryCode : countryCode,
            flagURL : flagURL
        }, function (err, country) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //country has been created
                  console.log('POST creating new country: ' + country);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("countries");
                        // And forward to success page
                        res.redirect("/countries");
                    },
                    //JSON response will show the newly created country
                    json: function(){
                        res.json(country);
                    }
                });
              }
        })
    });

/* GET New country page. */
router.get('/new', function(req, res) {
    res.render('countries/new', { title: 'Add New country' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Country').findById(id, function (err, country) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(country);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Country').findById(req.id, function (err, country) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + country._id);
        res.format({
          html: function(){
              res.render('countries/show', {
                "country" : country
              });
          },
          json: function(){
              res.json(country);
          }
        });
      }
    });
  });

 router.route('/:id/edit')
// 	//GET the individual country by Mongo ID
// 	.get(function(req, res) {
// 	    //search for the country within Mongo
// 	    mongoose.model('country').findById(req.id, function (err, country) {
// 	        if (err) {
// 	            console.log('GET Error: There was a problem retrieving: ' + err);
// 	        } else {
// 	            //Return the country
// 	            console.log('GET Retrieving ID: ' + country._id);
//               var countrydob = country.dob.toISOString();
//               countrydob = countrydob.substring(0, countrydob.indexOf('T'))
// 	            res.format({
// 	                //HTML response will render the 'edit.jade' template
// 	                html: function(){
// 	                       res.render('countries/edit', {
// 	                          title: 'country' + country._id,
//                             "countrydob" : countrydob,
// 	                          "country" : country
// 	                      });
// 	                 },
// 	                 //JSON response will return the JSON output
// 	                json: function(){
// 	                       res.json(country);
// 	                 }
// 	            });
// 	        }
// 	    });
// 	})
	// //PUT to update a country by ID
	// .put(function(req, res) {
	//     // Get our REST or form values. These rely on the "name" attributes
	//     var countryName = req.body.countryName;
	//     var countryCode = req.body.countryCode;
	//     var flagURL = req.body.flagURL;

	//     //find the document by ID
	//     mongoose.model('country').findById(req.id, function (err, country) {
	//         //update it
	//         country.update({
	//             countryName : countryName,
	//             countryCode : countryCode,
	//             flagURL : flagURL
	//         }, function (err, countryID) {
	//           if (err) {
	//               res.send("There was a problem updating the information to the database: " + err);
	//           } 
	//           else {
	//                   //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
	//                   res.format({
	//                       html: function(){
	//                            res.redirect("/countries/" + country._id);
	//                      },
	//                      //JSON responds showing the updated values
	//                     json: function(){
	//                            res.json(country);
	//                      }
	//                   });
	//            }
	//         })
	//     });
	// })
	//DELETE a country by ID
	.delete(function (req, res){
	    //find country by ID
	    mongoose.model('Country').findById(req.id, function (err, country) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            country.remove(function (err, country) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + country._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/countries");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : country
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});

module.exports = router;