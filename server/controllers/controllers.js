var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var User = mongoose.model('User');
var Puppy = mongoose.model('Puppy');

module.exports = {

  createUser: function (req, res) {
    var password = passwordHash.generate(req.body.password);
    var user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: password
    })
    user.save(function (err) {
      if (err) {
        console.log(err);
          res.json({err:"error"});
      }
      else {
        console.log("saved:", user);
        res.json({'user': user})
      }
    })
  },

  createPuppy: function (req, res) {
    User.findOne({_id: req.body.puppy.user_id}, function(err, post){
      var puppy = new Puppy({image: req.body.puppy.image, name: req.body.puppy.name, description: req.body.puppy.description, price: req.body.puppy.price, location: req.body.puppy.location, created_at: Date.now()});
      puppy._user = req.body.puppy.user_id;
      console.log("CONTROLLER", puppy);

      post.puppies.push(puppy);
      puppy.save(function(err){
        if (err) {
          console.log("err", err);
          res.json({err:err});
        }
        else {
          post.save(function(err){
            if (err) {
              console.log("Unable to save puppy");
              res.json({err:err});
            }
            else {
              console.log("saved");
              res.json({'puppy':puppy});
            }
          })
        }
      })

    })
  },

    index: function(req, res) {
      User.find({}, function(err, users) {
        res.json({'users': users});
      })
    },

    posts: function(req, res) {
      Puppy.find({}, function(err, puppies) {
        res.json({'puppies': puppies});
      })
    },

    user: function(req, res) {

      console.log("inside controller", req.body);
      var password = passwordHash.generate(req.body.password)

      User.find({email: req.body.email}, function(err, user) {
        console.log("user exist?:", user);
        if (user.length > 0) {
          if (passwordHash.verify(req.body.password, user[0].password)) {
            console.log("user exists - correct password");
            res.json({'user': user});
          }
          else {
            console.log("user exists - incorrect password");
            res.json({'user': []});
          }
        }
        else {
          console.log("user doesn't exist");
          res.json({'user': []});
        }
      })
    },

    updatePuppy: function(req, res) {
      console.log("inside controllers - UPDATE", req.body);
      Puppy.findOne({_id: req.body.id}, function(err, puppy){
        puppy.image = req.body.puppy.image,
        puppy.name = req.body.puppy.name,
        puppy.description = req.body.puppy.description,
        puppy.price = req.body.puppy.price,
        puppy.location = req.body.puppy.location,
        puppy.save(function(err){
          if (err) {
            res.json({err:err})
          }
          else {
            res.json({updated:"updated"})
          }
        });
      });
    },

    delete: function(req, res) {
      console.log("inside controllers - DELETE", req.body);
      var puppies = []
      User.findOne({_id:req.body.userID}, function (err, user) {
        for (var i = 0; i < user.puppies.length; i++) {
          if (user.puppies[i] == req.body.id) {
            console.log("Found index:", i);
            puppies = user.puppies.splice(i, 1);
          };
        }
        console.log("puppies array:", user.puppies);
        user.save(function (err) {
          // if (err) {
          //   res.json({err:err})
          // }
          // else {
          //   res.json({delete:"deleted"})
          // }
        })
      });

      Puppy.remove({_id: req.body.id}, function(err){
        if (err) {
          res.json({err: err})
        }
        else {
          res.json({removed:"removed"})
        }
      });
    },

  }
