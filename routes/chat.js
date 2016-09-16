var express = require('express');
var router = express.Router();
var Msg = require('../models/Msg.js');
var User = require('../models/User.js');
var clients = [];
//socket api for talk
router.talk = function (socket) {

    function msgStore(msg){
        var from = msg.from;
        var to = msg.to;
        Msg.create(msg);
        User.findByIdAndUpdate(from,{ $addToSet:{'msgs.send':msg}},function (err, doc) {
            if (err) return handleError(err);
            if (!doc) {
                console.log('fail2')
            }
        });
        User.findByIdAndUpdate(to,{ $addToSet:{'msgs.receive':msg}}, function (err, doc) {
            if (err) return handleError(err);

        });

    }
    function msgUnreadStore(msg){
        var from = msg.from;
        var to = msg.to;
        Msg.create(msg);
        User.findByIdAndUpdate(from,{ $addToSet:{'msgs.send':msg}},function (err, doc) {
            if (err) return handleError(err);
            if (!doc) {
                console.log('fail2')
            }
        });
        User.findByIdAndUpdate(to,{ $addToSet:{'msgs.unread':msg}}, function (err, doc) {
            if (err) return handleError(err);

        });
    }
    socket.on('init', function (userId) {
        clients[userId] = socket;
        socket.id = userId;
        console.log('The user '+userId+ ' has inited ');
    });
    socket.on('send msg', function (msg) {
        var from = msg.from;
        var to = msg.to;
        var toSocket;
        if(to in clients)
        {
            toSocket = clients[to];
            toSocket.emit('new msg',msg);
            console.log('The user '+from+ ' send message to '+to);
            socket.emit('msg received', msg);
            msgStore(msg);
        }else{
            socket.emit('msg saved', msg);
            msgUnreadStore(msg);
        }
    });
};

module.exports = router;