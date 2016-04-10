angular.module('starter.controllers',[])
//angular.module('starter.controllers', ['starter.services'])
// .controller('SessionsCtrl',function($scope, Session){
//   $scope.sessions = Session.query();
// })

// .controller('SessionCtrl',function($scope, $stateParams, Session){
//   $scope.session = Session.get({sessionId: $stateParams.sessionId});
// })

.controller('SignupCtrl', function($scope, $rootScope, $state) {
  $scope.signup = [];
  $scope.signupform;

  $scope.signUpUser = function(form){
  	$scope.submitted = true;
  	if (form.$valid){
  		console.log("the name is:");
  		console.log($scope.signup.name);
  		$state.go('tour',{firstName:$scope.signup.name});
  	}
  }


});
