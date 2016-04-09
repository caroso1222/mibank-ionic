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
		"showavatar":true,
		"value":"Hola. He sido entrenado durante siglos para este momento. Puedes preguntarme lo que sea, pero ten en cuenta que estoy autorizado a hablar solamente de temas financieros."
	};
	$scope.messages.push(message);
	message = {
		"who":"user",
		"showavatar":true,
		"value":"Hola mibank"
	};
	$scope.messages.push(message);

	$scope.newUserMessage = function(){
		var input = $scope.input.chat;
		var message = {
			"who":"user",
			"showavatar":false,
			"value":input
		};
		$scope.messages.push(message);
		$scope.input.chat = "";
	}
});
