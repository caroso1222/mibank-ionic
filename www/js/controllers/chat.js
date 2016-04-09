angular.module('starter.controllers')
//angular.module('starter.controllers', ['starter.services'])
// .controller('SessionsCtrl',function($scope, Session){
//   $scope.sessions = Session.query();
// })

// .controller('SessionCtrl',function($scope, $stateParams, Session){
//   $scope.session = Session.get({sessionId: $stateParams.sessionId});
// })

.controller('ChatCtrl', function($scope, $rootScope, $http) {
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
	//$scope.messages.push(message);

	$scope.newUserMessage = function(){

		var message = {
			"who":"user",
			"showavatar":true,
			"value":$scope.input.chat
		};
		$scope.messages.push(message);
		$scope.input.chat = "";


		var json_data = {
			"text":$scope.input.chat,
			"lat":"1.22331",
			"long":"-31.22331"
		};

		var req = {
			method: 'POST',
			url: 'http://104.236.93.10:8000/api/v1/bot/proccess',
			data: json_data,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}

		$http(req).
		success(function(data, status, headers, config) 
		{
			console.log("success");
			console.log(data);

			var message = {
				"who":"mibank",
				"showavatar":true,
				"value":data.message
			};
			$scope.messages.push(message);
			$scope.input.chat = "";

		}).
		error(function(data, status, headers, config) 
		{
			console.log("error");
			console.log(data);
		});
	}

	function printATMQuestion(){
		
	}

});
