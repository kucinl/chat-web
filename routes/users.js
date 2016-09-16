var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/User.js');
/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

// JSON API for creating a new user
router.post('/register', function (req, res) {
	var reqBody = req.body;
	var userObj = {
		account: reqBody.account
		, pwd: reqBody.pwd
		,username: reqBody.account
	};
	var user = new User(userObj);
	user.save(function (err, doc) {
		if (err || !doc) {
			console.log(err.message);
		} else {
			res.json(doc);
		}
	});
});

router.post('/login', function (req, res, next) {
	var user = {
		account: req.body.account
		, pwd: req.body.pwd
	};
	User.findOne({
		account: user.account
		, pwd: user.pwd
	}, function (err, doc) {
		if (err) {
			throw 'Error';
		} else if (!doc) {
			res.json({});
		} else {
			var token = jwt.sign(doc, config.secret, {
				expiresInMinutes: 1440 // expires in 24 hours
			});
			req.session.account = doc.account;
			res.json({user:doc,token:token})

		}
	})
});

router.get('/info', function (req, res) {
	var account = req.session.account;
	if (account === undefined) {
		res.json({});
	} else {
		User.findOne({
			account: account
		}, function (err, doc) {
			if (err) {
				throw 'Error';
			} else if (!doc) {
				res.json();
			} else {
				//更新session
				res.json(doc);
			}
		})
	}
});
router.post('/info', function (req, res) {
	var userId = req.body.userId;
	User.findById(userId, function (err, doc) {
		if (err) {
			res.json({success:false});
		} else if (!doc) {
			res.json({username: 'wrong'});
		} else {
			//更新session
			res.json(doc);
			doc.msgs.unread = [];
			doc.save();
		}
	})
});
router.post('/info_by_account', function (req, res) {
	var account = req.body.account;
	User.findOne({'account':account}, function (err, doc) {
		if (err) {
			res.json({success:false});
		} else if (!doc) {
			res.json({success:false});
		} else {
			res.json(doc);
		}
	})
});
/*router.post('/addFriend', function (req, res) {
	var userId = req.body.userId;
	var friendId = req.body.friendId;
	User.findByIdAndUpdate(userId,{ $addToSet:{'friends':{
		friendId: friendId
			, friendDate: new Date()
	}}},function (err, doc) {
		if (err) return handleError(err);
		if (!doc) {
			console.log('fail2')
		}
	});
	User.findByIdAndUpdate(friendId,{ $addToSet:{'friends':{
		friendId: userId
		, friendDate: new Date()
	}}}, function (err, doc) {
		if (err) return handleError(err);

	});
});*/
router.post('/addFriend', function (req, res) {
	var userId = req.body.userId;
	var friendId = req.body.friendId;
	var gid = req.body.gid;
	User.findById(userId,function(err,doc){
		if (!err) {
			if (doc) {
				var group = doc.fgroups.id(gid);
				group.friends.push( {friendId:friendId});
				doc.save();
				res.json({success:true});
			}else{
				res.json({success:false});
			}
		}else{
			res.json(err);
		}
	});
});
router.post('/deleteFriend', function (req, res) {
	var userId = req.body.userId;
	var friendId = req.body.friendId;
	var groupId = req.body.groupId;
	User.findById(userId,function(err,doc){
		if (!err) {
			if (doc) {
				var group = doc.fgroups.id(groupId);
				group.friends.pull( friendId);
				doc.save();
				res.json({success:true});
			}else{
				res.json({success:false});
			}
		}else{
			res.json(err);
		}
	});
	/*var group = user.fgroups.id(gruopId);
	console.log( group )
	group.friends.pull({friendId:friendId},function (err, doc) {
		console.log(err)
		if (err) res.json({success:false});
		else res.json({success:true});
	});*/
});
router.post('/changeFriendGroup', function (req, res) {
	var userId = req.body.userId;
	var friendId = req.body.friendId;
	var gfid = req.body.gfid;
	var gid = req.body.groupId;
	var ngid = req.body.ngid;
	User.findById(userId,function(err,doc){
		if (!err) {
			if (doc) {
				var group1 = doc.fgroups.id(gid);
				var group2 = doc.fgroups.id(ngid);
				group1.friends.pull(gfid);
				group2.friends.push( {friendId:friendId});
				doc.save();
				res.json({success:true});
			}else{
				res.json({success:false});
			}
		}else{
			res.json(err);
		}
	});
});
router.post('/addGroup', function (req, res) {
	var userId = req.body.userId;
	var groupName = req.body.groupName;
	User.findByIdAndUpdate(userId,{ $addToSet:{'fgroups':{
		name: groupName
	}}},function (err, doc) {
		if (err) res.json({success:false});
		else {
			res.json({success:true});
		}
	});
});
router.post('/deleteGroup', function (req, res) {
	var userId = req.body.userId;
	var groupName = req.body.groupName;
	User.findByIdAndUpdate(userId,{ $pull:{'fgroups':{
		name: groupName
	}}},function (err, doc) {
		if (err) res.json({success:false});
		else {
			res.json({success:true});
		}
	});
});

/*router.post('/getFriendList', function (req, res) {
 var userId = req.body._id;
 var friendId = req.params.friendId;
 User.findById(userId, function (err, doc) {
 if (err) return handleError(err);
 doc.friends.addToSet({
 friendId: friendId
 , friendDate: new Date()
 })
 res.json(doc);
 });
 User.findById(friendId, function (err, doc) {
 if (err) return handleError(err);
 doc.friends.addToSet({
 friendId: userId
 , friendDate: new Date()
 })
 res.json(doc);
 });

 });*/
module.exports = router;