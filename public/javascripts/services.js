angular.module('polls.services', ['ngResource'])
    .factory('User', function ($resource) {
        return $resource('user/:func', {}, {
            login: {
                method: 'POST'
                , params: {
                    func: 'login'
                }
            }
            , register: {
                method: 'POST'
                , params: {
                    func: 'register'
                }
            }
            , getBySession: {
                method: 'GET'
                , params: {
                    func: 'info'
                }
            }
            , getById: {
                method: 'POST'
                , params: {
                    func: 'info'
                }
            }
            , getByAccount: {
                method: 'POST'
                , params: {
                    func: 'info_by_account'
                }
            }
            ,addFriend:{
                method: 'POST'
                , params:{
                    func: 'addFriend'
                }
            }
            ,deleteFriend:{
                method: 'POST'
                , params:{
                    func: 'deleteFriend'
                }
            }
            ,changeFriendGroup:{
                method: 'POST'
                , params:{
                    func: 'changeFriendGroup'
                }
            }
            ,addGroup:{
                method: 'POST'
                , params:{
                    func: 'addGroup'
                }
            }
            ,deleteGroup:{
                method: 'POST'
                , params:{
                    func: 'deleteGroup'
                }
            }
            ,getUnread:{
                method: 'GET'
                , params:{
                    func: 'getUnread'
                }
            }
        })
    })
    .factory('socket', function ($rootScope) {
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            }
            , emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    });