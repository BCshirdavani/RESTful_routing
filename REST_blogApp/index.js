// index.js


var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);    // shoudl fix deprecation warning...
var methodOverride = require("method-override"); // POST to PUT override in edit.ejs


mongoose.connect("mongodb://localhost:27017/rest_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));                      // enable serving of custom style sheet
app.use(methodOverride("_method")); // POST to PUT override in edit.ejs


//==================================================================== DATA
// Mongoose Model Config
// create schema
// with some default values pre-inputted
var blogSchema = new mongoose.Schema({
    title: String,
    image: {type: String, default: "https://i.kym-cdn.com/entries/icons/mobile/000/001/030/DButt.jpg"},
    body: String,
    created: {type: Date, default: Date.now()}
})
// create model
var Blog = mongoose.model("Blog", blogSchema);


// Blog.create({
//     title: "test blog",
//     image: "https://images.unsplash.com/photo-1470921346718-b615f097684b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
//     body: "some words for the body here...I guess this is a city"
// })




//==================================================================== ROUTES
/*
INDEX       /blogs              GET         list all blogs
NEW         /blogs/new          GET         show new blog form
CREATE      /blogs              POST        create new blog, and redirect
SHOW        /blogs/:id          GET         show info for specific blog
EDIT        /blogs/:id/edit     GET         show edit form for one blog
UPDATE      /blogs/:id          PUT         update a specific blog, and redirect
DESTROY     /blogs/:id          DELETE      delete particular blog, and redirect
*/

//-------------------------------------------------------- INDEX
// root redirects me to '/blogs'
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});
// setup route for '/blogs'
app.get("/blogs", function(req, res){
    // find all the data
    Blog.find({}, function(error, blogs){
        if(error){
            console.log("error: ", error);
        } else {
            // render the page, with the data = blogs
            res.render("index.ejs", {blogs: blogs}); 
        }
    });
});

//-------------------------------------------------------- NEW
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//-------------------------------------------------------- CREATE
app.post("/blogs", function(req, res){
    // create blog - data is held in 'req.body.blog' - taken from the new.ejs form
    Blog.create(req.body.blog, function(error, newBlog){
        if (error){
            console.log("error: ", error);
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//-------------------------------------------------------- SHOW
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(error, foundBlog){
        console.log("show route");
        console.log("req.params.id: ", req.params.id);
        console.log("req.params: ", req.params);
        if(error){
            console.log("error: ", error);
            console.log("redirecting back to index");
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});


//-------------------------------------------------------- EDIT
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(error, foundBlog){
        console.log("edit route");
        if(error){
           res.redirect("/blogs");
           console.log("error: ", error);
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});




//-------------------------------------------------------- UPDATE
app.put("/blogs/:id", function(req, res){
    // var query = {_id: req.params.id};
    // Blog.findOneAndUpdate(query, req.body.blog, {new: true}, function(error, updatedBlog){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, updatedBlog){
    console.log("update route");
        if(error){
            res.redirect("/blogs");
            console.log("error: ", error);
        } else{
            console.log("req.params.id = ", req.params.id);
            console.log("about to res.render : /blogs/" + req.params.id);
            res.redirect("/blogs/" + req.params.id);
        }
    });
});











app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running");
});