angular.module('starter.controllers', [])
//angular.module('starter.controllers', ['starter.services'])
// .controller('SessionsCtrl',function($scope, Session){
//   $scope.sessions = Session.query();
// })

// .controller('SessionCtrl',function($scope, $stateParams, Session){
//   $scope.session = Session.get({sessionId: $stateParams.sessionId});
// })

.controller('ChatCtrl', function($scope, $rootScope) {
  console.log("chat ctrl loaded");
  $scope.messages = [];
  var message = {
  	"who":"mibank",
  	"value":"Hola user"
  };
  $scope.messages.push(message);
  message = {
  	"who":"user",
  	"value":"Hola mibank"
  };
  $scope.messages.push(message);
});
