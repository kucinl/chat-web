var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pollsapp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
  console.log('pollsapp open');
});
exports.mongoose = mongoose;