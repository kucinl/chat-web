angular.module('polls.controllers', ['ui.router'])
	// talk test
	.controller('MainCtrl', function ($scope, $rootScope, $stateParams, socket, User) {
		/*User.getUnread(function(msg){
			var saved = {
				to: msg.to,
				from: msg.from,
				name: msg.name,
				avatar: msg.avatar,
				content: msg.content,
				date: msg.date,
			};
			$scope.msgs.push(saved);
			$scope.unreadMsgs.push(saved);
			$scope.$broadcast('new msg', saved);
		})*/
		$scope.mv={
			location:"主页"
		}
		socket.on('msg received', function (msg) {
			var saved = {
				to: msg.to,
				from: msg.from,
				name: msg.name,
				avatar: msg.avatar,
				content: msg.content,
				date: msg.date,
				position: 'right',
			};
			$scope.msgs.push(saved);
			$scope.$broadcast('msg received', saved);
		});
		socket.on('msg saved', function (msg) {
			var saved = {
				to: msg.to,
				from: msg.from,
				name: msg.name,
				avatar: msg.avatar,
				content: msg.content,
				date: msg.date,
				position: 'right',
			};
			$scope.msgs.push(saved);
			$scope.$broadcast('msg saved', saved);
		});
		socket.on('new msg', function (msg) {
			var saved = {
				to: msg.to,
				from: msg.from,
				name: msg.name,
				avatar: msg.avatar,
				content: msg.content,
				date: msg.date,
			};
			$scope.msgs.push(saved);
			$scope.unreadMsgs.push(saved);
			$scope.$broadcast('new msg', saved);
		});
		$scope.$on('request unread',function(){
			$rootScope.$broadcast('unread');
		});
		$scope.$on('unread',function(){
			$rootScope.$broadcast('unread msgs',$scope.unreadMsgs);
		});
	})
	// Creating a new user
	.controller('UserRegisterCtrl', function ($scope, $rootScope, $location, $state, User, socket,$http) {
		$scope.mv.location="账号";
		$scope.myForm = {
			user: {
				account: $rootScope.user.account
				, pwd: $rootScope.user.pwd
			}
		};
		$scope.login = function () {
/*var req = {
      method: 'POST',
      url: '/user/login',
      headers: {
        'Content-Type':'application/json',
       'Accept':'application/json'
      },
      data: { 'username':'$scope.lv.account',
        'password':'$scope.lv.pwd'
      }
    }
   $http(req).then(function(res){
     console.log(res.data);
   },function(res){
     console.log(res.data);
   })*/
  
		var user = $scope.myForm.user;
			var newUser = new User(user);
			newUser.$login(function (res) {
				if (res.token === undefined) {
					// alert('false');
				} else {
					$rootScope.user = User.getBySession(function () {
						socket.emit('init', $rootScope.user._id);
						$location.path('friendManage');
					});
				}
			});
};
		$scope.createUser = function () {
			var user = $scope.myForm.user;
			var newUser = new User(user);
			newUser.$register(function (p, resp) {
				if (!p.error) {
					newUser.$login(function (res) {
						if (res.token === undefined) {
							// alert('false');
						} else {
							$rootScope.user = User.getBySession(function () {
								socket.emit('init', $rootScope.user._id);
								$location.path('friendManage');
							});
						}
					});
				} else {
					alert('Could not create user');
				}
			});
		};

	})
	// talk test
	.controller('TalkTestCtrl', function ($scope, $rootScope, $stateParams, socket, User) {
		$scope.mv.location="聊天进行中";
		$scope.msgContent = 'hahaha';
		$scope.msgs = [];
		var user = $rootScope.user;
		var friendId = $stateParams.friendId;
		$scope.friend = User.getById({}, {userId: friendId}, function () {});
		$scope.$on('unread msgs',function(event, unreadMsgs){
			for(var i = 0; i < unreadMsgs.length; i++){
				if(unreadMsgs[i].from === friendId){
					$scope.msgs.push(unreadMsgs[i]);
					unreadMsgs.splice(i,1);
					i--;
				}
			}
		});
		$scope.$on('msg received', function (event, msg) {
			if (msg.to === friendId) {
				$scope.msgs.push(msg);
			}
		});
		$scope.$on('msg saved', function (event, msg) {
			if (msg.to === friendId) {
				$scope.msgs.push(msg);
			}
		});
		$scope.$on('new msg', function (event, msg) {
			if (msg.from === friendId) {
				for(var i = 0; i < event.targetScope.unreadMsgs.length; i++){
					if(event.targetScope.unreadMsgs[i] === msg){
						event.targetScope.unreadMsgs.splice(i,1);
						break;
					}
				}
				$scope.msgs.push(msg);
			}
		});
		//$scope.$emit('request msg');
		$scope.$emit('request unread');
		$scope.sendMsg = function () {
			var msg = {
				content: $scope.msgContent,
				from: user._id,
				to: friendId,
				name: user.username,
				avatar: user.avatar,
				date: new Date()
			};
			socket.emit('send msg', msg);
		};
	})
	// Managing friends
	.controller('FriendsManageCtrl', function ($scope, $rootScope, User) {
		$scope.mv.location="我的好友";
		$scope.fmv={
			func:'show',
			newGname:'新分组',
			saccount:'',
			ssuccess:false
		}
	 	$scope.groups = getGroups();
		$scope.togAdd = function() {
			$scope.add=!$scope.add;
		};
		$scope.addGroup = function() {
			User.addGroup({}, {userId: $rootScope.user._id,groupName: $scope.fmv.newGname}, function (res) {
				$scope.add =false;
				$rootScope.user = User.getBySession(function() {
					$scope.groups = getGroups();
				});
			});
		};;
		$scope.deleteGroup = function(name) {
			User.deleteGroup({}, {userId: $rootScope.user._id,groupName: name}, function (res) {
				$rootScope.user = User.getBySession(function() {
					$scope.groups = getGroups();
				});
			});
		};;
		$scope.searchFriend = function() {
			User.getByAccount({}, {account: $scope.fmv.saccount}, function (res) {
				if(res.success == false){
					$scope.fmv.ssuccess = false;
				}else{
					$scope.fmv.sresult = res;
					$scope.fmv.ssuccess = true;
				}
			});
		};;
		$scope.addFriend = function (gid) {
			if(gid === undefined){

			}else{
				User.addFriend({}, {friendId: $scope.fmv.sresult._id, userId: $rootScope.user._id,gid:gid},function(res){
					$rootScope.user = User.getBySession(function() {
						$scope.groups = getGroups();
					});
				});
			}
		}
		$scope.deleteFriend = function(id,gid){
			User.deleteFriend({}, {friendId:id, userId:$rootScope.user._id,groupId:gid},function(res){
				$rootScope.user = User.getBySession(function() {
					$scope.groups = getGroups();
				});
			});
		}
		$scope.changeFriendGroup = function(id,gfid,gid,ngid){
			User.changeFriendGroup({}, {friendId:id, userId:$rootScope.user._id,gfid:gfid,groupId:gid,ngid:ngid},function(res){
				$rootScope.user = User.getBySession(function() {
					$scope.groups = getGroups();
				});
			});
		}
		function getGroups() {
			$rootScope.user.fgroups.forEach(function(group, index1, array1) {
				group.friends.forEach(function(friend, index2, array2) {
					User.getById({}, {userId: friend.friendId}, function (res) {
					//	if(res.username != 'wrong'){
						//有相同属性的话，前者会被后者覆盖
						$rootScope.user.fgroups[index1].friends[index2] = Object.assign(res,friend);
						//	group.friends.shift();
						//	group.friends.push(res);
					//	}
					});
				});
			});
			return $rootScope.user.fgroups;
		};
	})
	// Managing aside
	.controller('AsideCtrl', function ($scope, $rootScope, User) {
		/*var friends = [];
		$scope.friends = friends;
		getFriends();
		//$scope.apply();
		function getFriends() {
			for (var x in $rootScope.user.friends) {
				User.getById({}, {userId: $rootScope.user.friends[x].friendId}, function (res) {
					friends.push(res);
				});
			}
			return friends;
		};*/
	})
