// MomentJS library
var moment = require("moment");

// Mongoose
var mongoose = require('mongoose');

//Schema Created
var Schema = mongoose.Schema;

// Article Schema
var ArticlesSchema = new Schema({

  // Article Title
  title: {
    type: String,
    required: true
  },

  // Article Link 
  link: {
    type: String,
    required: true
  },
  
  // Article Summary
  summary: {
    type: String,
    required: true
  },

  // Scrape timestamp
  updated: {
    type: String,
    default: moment().format('MMMM Do YYYY, h:mm A')
  },

  // Comment model Relation
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]

});

var Article = mongoose.model('Article', ArticlesSchema);

module.exports = Article;