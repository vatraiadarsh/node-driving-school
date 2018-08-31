var express = require('express')
var app = express()
var bodyParser = require('body-parser');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routers


var courses = require('./routes/Courses.js');
var enquiry = require('./routes/Enquiry.js');




app.use(express.static('public'));
app.set('views','./views');
app.set('view engine', 'ejs');

// For courses
app.use("/courses", courses);
app.use("/enquiry", enquiry);


app.get("/dashboard", function(req, res) {
  res.render("dashboard");
})


app.listen(3000);
console.log("Server Started on port 3000")
