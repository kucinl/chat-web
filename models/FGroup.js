/**
 * Created by kucin on 2016/6/21 0021.
 */
var FGroupSchema = mongoose.Schema({
	name:String
	,friends: [{
		friendId: mongoose.Schema.Types.ObjectId
		, friendDate: Date
	}]
});

var FGroup = mongoose.model('fgroup', FGroupSchema);
module.exports = FGroup;