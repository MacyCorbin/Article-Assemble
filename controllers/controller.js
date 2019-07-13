//Node Dependencies
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');

// Import models: Comment and Article
var Comment = require('../models/Comment.js');
var Article = require('../models/Article.js');

// Page Render for first visit
router.get('/', function (req, res) {
    res.redirect('/scrape');
});

// Scrape data
router.get('/articles', function (req, res) {

    //Sort articles
    Article.find().sort({ _id: 1 })

        //Populate all of the comments with the articles.
        .populate('comments')

        // Send to handleabars
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                var hbsObject = { articles: doc }
                res.render('index', hbsObject);
            }
        });
});

// Web Scrape Route
router.get('/scrape', function (req, res) {

    request('https://www.livescience.com/environment', function (error, response, html) {

        // Load html into cheerio
        var $ = cheerio.load(html);

        var titlesArray = [];

        // Grab everything with li
        $('li').each(function (i, element) {

            // Create an empty result object
            var result = {};

            // Find title
            result.title = $(element).find("h2").text().trim();

            // Find link to article
            result.link = 'https://www.livescience.com' + $(element).find("a").attr("href");

            // Find summary of article
            result.summary = $(element).find("p").text().trim();

            if (result.title !== "" && result.summary !== "") {

                // Checks for duplicate articles
                if (titlesArray.indexOf(result.title) == -1) {

                    titlesArray.push(result.title);

                    Article.count({ title: result.title }, function (err, test) {

                        if (test == 0) {

                            var entry = new Article(result);
                            entry.save(function (err, doc) {

                                if (err) {
                                    console.log(err);

                                } else {
                                    console.log(doc);
                                }
                            });

                        } else {
                            console.log('Repeating database data and was not saved to database.')
                        }

                    });
                } else {
                    console.log('Repeated data was repeated and was not saved to database.')
                }

            } else {
                console.log('Empty Content and was not saved to database.')
            }

        });
        res.redirect("/articles");

    });
});


// Add Comment Route
router.post('/add/comment/:id', function (req, res) {

    //Collect Article ID
    var articleId = req.params.id;

    // Collect Author Name
    var commentAuthor = req.body.name;

    // Collect Comments
    var commentContent = req.body.comment;

    var result = {
        author: commentAuthor,
        content: commentContent
    };

    // Using the Comment model, create a new comment entry
    var entry = new Comment(result);

    // Save to database
    entry.save(function (err, doc) {
        // log errors
        if (err) {
            console.log(err);

        } else {
            // Push the new Comment to the comments section in the article
            Article.findOneAndUpdate({ '_id': articleId }, { $push: { 'comments': doc._id } }, { new: true })

                .exec(function (err, doc) {

                    if (err) {
                        console.log(err);
                    } else {

                        res.sendStatus(200);
                    }
                });
        }
    });
});

// Delete a comment
router.post('/remove/comment/:id', function (req, res) {

    // Get comment id
    var commentId = req.params.id;

    // Find and delete comment
    Comment.findByIdAndRemove(commentId, function (err, todo) {

        if (err) {
            console.log(err);

        } else {

            res.sendStatus(200);
        }
    });
});


// Export Router to Server.js
module.exports = router;