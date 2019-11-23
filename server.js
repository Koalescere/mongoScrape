// Dependencies
var express = require("express");
var mongoose = require('mongoose');
var exphbs = require("express-handlebars");
// var bodyParser = require("body-parser");

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 3000;

// Create an instance of the express app (instantiate).
var app = express();

// Set up an Express Router
var router = express.Router();

// require the file of the route and pass router objet
require("./config/routes")(router);

// Serve static content for the app from the "public" directory in the application directory.
// app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));

//connect handlebars to the express app
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Parse application body
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// all request go through router
app.use(router);

// https://mongoosejs.com/docs/api.html#mongoose_Mongoose-Collection
// optional callback that gets fired when initial connection completed
        // var uri = 'mongodb://nonexistent.domain:27000';
        // mongoose.connect(uri, function(error) {
        //   if error is truthy, the initial connection failed.
        // })


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// connect mongoose to database
mongoose.connect(MONGODB_URI, function(error){
    // Log any errors connecting with mongoose
    if (error){
        console.log(error);
    }
    else{
        console.log("mongoose connection is succesful")
    }

});



// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  
    // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
