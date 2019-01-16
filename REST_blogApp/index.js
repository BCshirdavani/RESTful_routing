// index.js


var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/rest_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));                      // enable serving of custom style sheet



















app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running");
});