var express = require('express')
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
router.use(express.static('public'));

// Mongo DB
MongoClient.connect('mongodb://adarsha:adarsha123@ds159273.mlab.com:59273/', {
  useNewUrlParser: true
}, function (err, db) {
  var dbo = db.db("node_deploy_school");
  router.get("/", function (req, res) {
    dbo.collection("studentpayments").aggregate([{
      $lookup: {
        from: 'enquiry',
        localField: '_id',
        foreignField: 'person_name',
        as: 'details'
      }
    }]).toArray(function (err, result) {
      if (err) throw err;
      res.render("studentpayments/index.ejs", {
        data: result
      })
    });
  });

  router.get("/create/:id", function (req, res) {
    var id = req.params.id
    dbo.collection("studentpayments").find({
      _id: new mongodb.ObjectID(id)
    }).toArray(function(err, result) {
      if(err) throw err;
      res.render("studentpayments/create.ejs", {
        data: result
      })
    })
  })
  router.post("/create/:id", function(req, res) {
    var id = req.params.id
    var studentpayments = req.body.studentpayments
    console.log(studentpayments);
    var myObj = []
    var response = {}
    for(var i = 0; i < studentpayments.length; i++) {
      myObj.push({
        name: studentpayments[i],
        date: new Date(),
        category: new mongodb.ObjectID(id)
      })
    }
    dbo.collection("studentpayments").insertMany(myObj, function(err, result) {
      if(err) throw err;
      response.status = true
      response.message = "Sucessfully inserted studentpayments."
      response.redirect = "/studentpayments"
      // Response
      res.json(response)
    })
  })

  
  router.get("/delete/:id", function(req, res) {
    var id = req.params.id
    var response = {}
    var delObject = {
      _id: new mongodb.ObjectID(id)
    }
    dbo.collection("studentpayments").deleteOne(delObject, function(err, obj) {
      if (err) throw err;
      response.status = true
      response.message = "Item Deleted Successfully"
      response.redirect = "/studentpayments"
      res.json(response)
    })
  })
  router.get("/delete/studentpayments/:id", function(req, res) {
    var id = req.params.id
    var response = {}
    var delObject = {
      _id: new mongodb.ObjectID(id)
    }
    dbo.collection("studentpayments").deleteOne(delObject, function(err, obj) {
      if (err) throw err;
      response.status = true
      response.message = "Item Deleted Successfully"
      response.redirect = "/studentpayments"
      res.json(response)
    })
  })
})
module.exports = router