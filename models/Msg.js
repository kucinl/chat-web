var mongoose = require('./mongoose').mongoose;

var MsgSchema = mongoose.Schema({
    content: String
    , time: Date
    , from: mongoose.Schema.Types.ObjectId
    ,to: mongoose.Schema.Types.ObjectId
});

var Msg = mongoose.model('msg', MsgSchema);
module.exports = Msg;