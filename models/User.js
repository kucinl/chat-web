var mongoose = require('./mongoose').mongoose;
var ObjectId = mongoose.Schema.Types.ObjectId;
var MsgSchema = mongoose.Schema({
    content: String
    , time: Date
    , from: ObjectId
    ,to: ObjectId
});
var FGroupSchema = mongoose.Schema({
    name:String
    ,friends: [{
        friendId: mongoose.Schema.Types.ObjectId
        , friendDate: Date
    }]
});
var UserSchema = mongoose.Schema({
    account: {
        type: String
        , required: true
    }
    , pwd: {
        type: String
        , required: true
    }
    , username: {
        type: String
        , default: 'noName'
    }
    , avatar: {
        type: String
        , default: 'static/user/defaultAvatar.jpg'
    }
    , fgroups: [FGroupSchema]
   // , fgroups: [{type:ObjectId,ref:'fgroup'}]
    , msgs: {
        send: [MsgSchema]
        , received: [MsgSchema],
        unread: [MsgSchema]
    }
});


var User = mongoose.model('user', UserSchema);
module.exports = User;