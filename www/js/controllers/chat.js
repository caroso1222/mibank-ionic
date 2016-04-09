angular.module('starter.controllers')
//angular.module('starter.controllers', ['starter.services'])
// .controller('SessionsCtrl',function($scope, Session){
//   $scope.sessions = Session.query();
// })

// .controller('SessionCtrl',function($scope, $stateParams, Session){
//   $scope.session = Session.get({sessionId: $stateParams.sessionId});
// })

.controller('ChatCtrl', function($scope, $rootScope, $http) {
	$scope.messages = [];
	console.log("chat ctrl loaded");
	appendBotTextMessage("Hola. Pregúntame lo que sea.",true);

	appendMultioptionQuestion(false);
	appendUserMessage("Hola",true);


	$scope.newUserMessage = function(){
		appendUserMessage($scope.input.chat, true);
		$scope.input.chat = "";
		//sendTextMessage($scope.input.chat);
		appendMultioptionQuestion(true);
	}

	function appendMultioptionQuestion(showAvatar){
		var messageReceived = {
			"buttons":[
			{ "code":"1", "value":"Que alguien confiable me ayude" },
			{ "code":"2", "value":"Que alguien me colabore" },
			{ "code":"3", "value":"Solo necesito un cajero" },
			{ "code":"4", "value":"No me quiero mover" }
			]	
		}

		var message_json = {
			"who":"mibank",
			"showavatar":showAvatar,
			"value":messageReceived.buttons,
			"type":"multioption"
		};
		$scope.messages.push(message_json);
	}

	function appendUserMessage(message, showAvatar){
		var message = {
			"who":"user",
			"showavatar":showAvatar,
			"value":message
		};
		$scope.messages.push(message);
	}

	function appendBotTextMessage(message, showAvatar){
		var message_json = {
			"who":"mibank",
			"showavatar":showAvatar,
			"value":message,
			"type":"text"
		};
		$scope.messages.push(message_json);
	}

	function sendTextMessage(message){
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
			appendBotTextMessage(data.message, true);

		}).
		error(function(data, status, headers, config) 
		{
			console.log("error");
			console.log(data);
		});
	}

});
