foodora takehome test
======================

## Installation
- Make sure MongoDB is installed (`brew install mongodb`)
- Create a MongoDB database named `countriesDB` (`use countriesDB`)
- Ensure mongo service is running `mongod`
- Install packages and start the express.js web service (`npm install && npm start`)
- Navigate to `http://127.0.0.1:3000` to see the homepage

## Front-End
- I mocked up a simple HTML and CSS front-end, I did not want to complicate it by using Bootstrap or another front-end framework for such a simple app.
- I assumed the test's purpose was not to design a nice front-end so I did not spend any appreciable time on it.

##Architecture/Design Decisions
- Simple boilerplate MVC app using NodeJS, Express, and MongoDB, with Jade layouts edited to fulfil intended function.
-The model in this case is country, which simply uses a schema of country and country code. It is very open to extensibility and could include more information about each country.
- On startup scripts/populateDB.js is run which pulls the country data from the pastebin link and populates the mongoDB database for later use.
- It also takes the pastebin data and generates a file at public/files/countries.txt which will be served up to download as a CSV on user request.
- I did not include unit tests, but it would be trivial to implement since both the database and csv file are created with a startup script. It would simply require running scripts/populateDB.js and validating the csv and database against the pastebin.


