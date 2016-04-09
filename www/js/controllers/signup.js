angular.module('starter.controllers',[])
//angular.module('starter.controllers', ['starter.services'])
// .controller('SessionsCtrl',function($scope, Session){
//   $scope.sessions = Session.query();
// })

// .controller('SessionCtrl',function($scope, $stateParams, Session){
//   $scope.session = Session.get({sessionId: $stateParams.sessionId});
// })

.controller('SignupCtrl', function($scope, $rootScope, $state) {
  console.log("signup ctrl loaded");

  $scope.goToTour = function(){
    $state.go('tour');
  }
});
