 angular.module('polls', ['ui.router', 'polls.controllers', 'polls.services'])
   .config(function ($stateProvider, $urlRouterProvider) {
     $stateProvider
       .state('register', {
         url: '/register'
         , templateUrl: 'static/templates/register.html'
         , controller: 'UserRegisterCtrl'
       })
       .state('login', {
         url: '/login'
         , templateUrl: 'static/templates/login.html'
         , controller: 'UserRegisterCtrl'
       })
       .state('talkTest', {
         url: '/talk/:friendId'
         , templateUrl: 'static/templates/talkTest.html'
         , controller: 'TalkTestCtrl'
       })
         .state('friendsManage', {
             url: '/friendsManage'
             , templateUrl: 'static/templates/friendsManage.html'
             , controller: 'FriendsManageCtrl'
         })
     $urlRouterProvider.otherwise('/friendsManage');
   })
   //和配置块不同，运行块在注入器创建之后被执行
   .run(function ($rootScope, $location, User, socket) {
       $rootScope.user = User.getBySession(function(){
               if ($rootScope.user.account === undefined) {
                   //alert($rootScope.user.account);
                   if ($location.path() !== "/login") {
                       $location.path('/login');
                   }
               }else{
                   socket.emit('init', $rootScope.user._id);
                   $rootScope.msgs = [];
                   $rootScope.unreadMsgs = $rootScope.user.msgs.unread;
               }
        /*   $rootScope.$on('$locationChangeStart', function (evt, next, current) {
               // 如果用户未登录
               if ($rootScope.user.account === undefined) {
                   //alert($rootScope.user.account);
                   if (next.templateUrl === "static/templates/login.html" ||next.templateUrl === "static/templates/register.html") {
                       // 已经转向登录路由因此无需重定向
                   } else {
                      // $location.path('/login');
                       evt.preventDefault();
                   }
               }
           });*/
     }
     );
   });