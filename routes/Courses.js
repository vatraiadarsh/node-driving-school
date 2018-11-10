var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
router.use(express.static('public'));

// Mongo DB
MongoClient.connect('mongodb://adarsha:adarsha123@ds159273.mlab.com:59273/', {useNewUrlParser: true}, function(err, db) {
  var dbo = db.db('node_deploy_school');
  router.get('/', function(req, res) {
    dbo.collection('courses').find({}).toArray(function(err, result) {
      if (err) throw err;
      res.render('courses/index.ejs', {
        data: result,
      });
    });
  });

  router.get('/create', function(req, res) {
    res.render('courses/create.ejs');
  });
  router.post('/create', function(req, res) {
    var response = {};
    var course = req.body;
      // Form validation
    if (course.name == '' || course.description == '' || course.fees == '' || course.duration == '' || course.shift == '') {
      response.status = false;
      response.message = 'Sorry, invalid field!';
      // Response
      res.json(response);
    } else {
      var newCourse = {
        name: course.name,
        description: course.desc,
        fees: course.fees,
        duration: course.duration,
        shift: course.shift,
        date: new Date(),
      };
      dbo.collection('courses').insertOne(newCourse, function(err, result) {
        if (err) throw err;
        response.status = true;
        response.message = 'Sucessfully inserted Courses.';
        response.redirect = '/courses';
          // response.saveContinue = "/courses/create"
          // Response
        res.json(response);
      });
    }
  });

  router.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var response = {};
    var delObject = {
      _id: new mongodb.ObjectID(id),
    };
    dbo.collection('courses').deleteOne(delObject, function(err, result) {
      if (err) throw err;
      response.status = true;
      response.message = 'Item Deleted Successfully';
      response.redirect = '/courses';
      res.json(response);
    });
  });
});
module.exports = router;
