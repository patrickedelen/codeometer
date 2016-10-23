var express = require('express');
var router = express.Router();

var user = require('../models/user.js');

var tweetHandler = require('../bin/tweetHandler.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/user/create', function(req, res, next) {
  user.findOne({email: req.body.email}, function(err, selUser){
    if(err || selUser){
      res.json({message: 'User already exists'});
      console.log('User exists');
      console.log(selUser);
    } else {
        var User = new user({
          email: req.body.email
        });
        User.save();

        res.json({message: 'User created'});
    }
  });

});

router.post('/api/user/report', function(req, res, next) {
  //console.log(req.body.email);
  //console.log(req.body.report);
  
  if(req.body.email){  
    user.find({email: req.body.email}, function(err, selUser){
      if(err){
        console.log(err);
      } else {
        //selUser.reports.push(req.body.report);
        //selUser.save();
        var date = new Date();

        selUser[0].reports[selUser[0].reports.length] = {
          lines : req.body.report
        };

        selUser[0].totalLines += parseInt(req.body.report);

        selUser[0].save();

        res.json({message: 'Report added'});

        tweetHandler.updateTweets(selUser[0]);
      }
    });
  } else {
    res.json({error: 'No email specified'});
  }

  //update tweeting


});

router.post('/api/user/addMember', function(req, res, next) {
  console.log(req.body.email);
  console.log(req.body.member);
  
  if(req.body.email){  
    user.find({email: req.body.email}, function(err, selUser){
      if(err){
        console.log(err);
      } else {

        selUser[0].team.push(req.body.member)

        selUser[0].save();

        res.json({message: 'Member added'});
      }
    });
  } else {
    res.json({error: 'No email specified'});
  }

});

router.get('/api/user/all', function(req, res, next) {
  
  user.find({}, function(err, users) {
      if(err){
        res.json({error: 'Error occured'})
      } else {
        res.json(users);
      }
  });

router.post('/api/user/get', function(req, res, next) {
  user.findOne({email: req.body.email}, function(err, foundUser) {
   if(err){
     res.json({err: 'Request error: user not found'});
   } else {
     res.json(foundUser);
   }
  });
});

});
module.exports = router;
