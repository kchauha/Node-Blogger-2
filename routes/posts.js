var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images' });
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {

	var categories = db.get('categories');
	categories.find({}, {}, function(err, categories){
		 res.render('addposts', {
  			'title' : 'Addposts',
  			'categories' : categories
  		});
	});
});

router.post('/add',upload.single('mainimage'), function(req, res, next) {
  //get form values
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();
  console.log(title);
  if(req.file){
  	var mainimage = req.file.filename;
  }else{
  	var mainimage = 'noimage.jpg';
  }

  //Form validation
  req.checkBody('title','Title field is mandatory').notEmpty();
  req.checkBody('body','Body field is mandatory').notEmpty();

  //Check Errors
  var errors = req.validationErrors();

  if(errors){
  	res.render('addposts',{
  		"errors" : errors
  	});
  }else{
  	var posts = db.get('posts');
  	posts.insert({
  		"title": title,
  		"body" : body,
  		"category" : category,
  		"date": date,
  		"author" : author,
  		"mainimage" : mainimage
  	}, function(err,post){
  		if(err){
  			res.send(err);
  		}else{
  			req.flash('success', 'Post Added');
  			res.location('/');
  			res.redirect('/');
  		}
  	})
  }
});

module.exports = router;
