// Node Dependencies List
var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan'); 
var request = require('request'); 
var cheerio = require('cheerio'); 


// Initialize Express 
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))

// Static Content
app.use(express.static(process.cwd() + '/public'));

// Express-Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Mongoose Connection
// if(process.env.NODE_ENV == 'production'){
//   mongoose.connect('mongodb://heroku_bktjf7vr:qbjvgbtn3iasdetb97v0uf5oht@ds161503.mlab.com:61503/heroku_bktjf7vr');
// }
// else{
//   mongoose.connect('mongodb://localhost/news-scraper');
// }
// var db = mongoose.connection;

// mongoose.connect( // Connect to the Mongo DB
//   process.env.MONGODB_URI || "mongodb://heroku_bktjf7vr:qbjvgbtn3iasdetb97v0uf5oht@ds161503.mlab.com:61503/heroku_bktjf7vr"
// );


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Mongoose errors
// db.on('error', function(err) {
//   console.log('Mongoose Error: ', err);
// });

// // // Connection console log
// db.once('open', function() {
//   console.log('Mongoose connection successful.');
// });

// Import models: Comment and Artcle
var Comment = require('./models/Comment.js');
var Article = require('./models/Article.js');

// Import Routes/Controller
var router = require('./controllers/controller.js');
app.use('/', router);

// Set up port
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});
