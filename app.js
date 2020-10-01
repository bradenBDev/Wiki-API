const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);


// Requests targeting all articles

app.route("/articles")

    .get(function (req, res) {

        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post(function (req, res) {

        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });

        article.save(function (err) {
            if (!err) {
                res.send("Successfully added article.");
            } else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {

        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });


// Requests targeting specific article

app.route("/articles/:articleName")

    .get(function (req, res) {

        Article.findOne({title: req.params.articleName}, function (err, foundArticle) {
            if (!err && foundArticle) {
                res.send(foundArticle);
            } else if (!err && !foundArticle) {
                res.send("No articles matching your title were found.");
            } else {
                res.send(err);
            }
        });
    })

    .put(function (req, res) {

        Article.update(
            {title: req.params.articleName},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function (err) {
                if (!err) {
                    res.send("Successfully updated article.");
                }
            }
        );
    })

    .patch(function (req, res) {

        Article.update(
            {title: req.params.articleName},
            {$set: req.body},
            function (err) {
                if (!err) {
                    res.send("Successfully updated article.");
                } else {
                    res.send(err);
                }
            }
        );
    })

    .delete(function (req, res) {
        Article.deleteOne({title: req.params.articleName}, function (err) {
            if (!err) {
                res.send("Successfully deleted article.");
            }
        });
    });


// Spin up the server

app.listen(3000, function() {
    console.log("Server started on port 3000");
});