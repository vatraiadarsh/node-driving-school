var express = require('express')
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
router.use(express.static('public'));

// Variable DB
var gdb;

// Mongo DB
MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, function(err, db) {
  var dbo = db.db("drivingSchool");
  router.get("/", function(req, res) {
    dbo.collection("enquiry").aggregate([
        { $lookup:
         {
           from: 'courses',
           localField: 'name',
           localField:'duration',
           foreignField: '_id',
           as: 'details'
         }
       }
      ]).toArray(function(err, result) {
        if (err) throw err;
        res.render("enquiry/index.ejs", {
          data: result
        })
      });
    });

    router.get("/create", function(req, res) {
        dbo.collection("courses").find({}).toArray(function(err, result) {
          if (err) throw err;
          res.render("enquiry/create.ejs", {
            data: result
          })
        });
      });


    
  router.post("/create", function(req, res) {
    var response = {}
    var enquiry = req.body
    // Form validation
    if(enquiry.person_name == '' || enquiry.desc == '' || enquiry.fees == '' || enquiry.dob == '' || enquiry.email == '' || enquiry.address == '' || enquiry.contact_no == '' || enquiry.timing == '') {
      response.status = false
      response.message = "Sorry, invalid field!"
      // Response
      res.json(response)
    }
    else {
      var newEnquiry = {
        personName: enquiry.person_name,
        name: new mongodb.ObjectID(enquiry.name),
        duration: new mongodb.ObjectID(enquiry.duration),
        dob: enquiry.dob,
        email: enquiry.email,
        address: enquiry.address,
        longitude: enquiry.longitude,
        latitude: enquiry.latitude,
        contactNo: enquiry.contact_no,
        timing: enquiry.timing,
        date: new Date()
      }
      dbo.collection("enquiry").insertOne(newEnquiry, function(err, ress) {
        if (err) throw err;
        response.status = true
        response.message = "Sucessfully inserted enquiry."
        response.redirect = "/enquiry"
        // Response
        res.json(response)
      });
    }
  })

  router.get("/delete/:id", function(req, res) {
    var id = req.params.id
    var response = {}
    var delObject = {
      _id: new mongodb.ObjectID(id)
    }
    dbo.collection("enquiry").deleteOne(delObject, function(err, result) {
      if (err) throw err;
      response.status = true
      response.message = "Item Deleted Successfully"
      response.redirect = "/enquiry"
      res.json(response)
    })
  })

});
module.exports = router