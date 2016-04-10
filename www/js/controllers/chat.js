	angular.module('starter.controllers')
	//angular.module('starter.controllers', ['starter.services'])
	// .controller('SessionsCtrl',function($scope, Session){
	//   $scope.sessions = Session.query();
	// })

	// .controller('SessionCtrl',function($scope, $stateParams, Session){
	//   $scope.session = Session.get({sessionId: $stateParams.sessionId});
	// })

	.controller('ChatCtrl', function($scope, $rootScope, $http, $cordovaGeolocation, $stateParams) {
		$scope.messages = [];
		console.log("chat ctrl loaded");
		appendBotTextMessage("Hola "+ $stateParams.firstName +"! Pregúntame lo que sea.",true);
		console.log("this is the name");
		console.log($stateParams.firstName);
		//appendATMCard(false);

		//appendMultioptionQuestion(false);
		//appendUserMessage("Hola",true);

		$scope.sizeOfContent = 0;
		$scope.scrollable = false;

		$scope.newUserMessage = function(){
			if($scope.input.chat != ""){
				appendUserMessage($scope.input.chat, true);
				
				


				var posOptions = {timeout: 10000, enableHighAccuracy: false};
				$cordovaGeolocation
				.getCurrentPosition(posOptions)
				.then(function (position) {
					var lat  = position.coords.latitude
					var long = position.coords.longitude
					sendTextMessage($scope.input.chat,lat,long);
					$scope.input.chat = "";	
				}, function(err) {
					console.log("theres an error");
				});




			}
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
			$scope.sizeOfContent += 252;
		}

		function appendATMCard(data,showAvatar){
			var messageReceived = {
				"card": {
					"Type": "CHANNEL_TYPE",
					"Data": {
						"Id": 0,
						"type": "oficina",
						"name": "",
						"lat": "",
						"lng": "",
						"city": "",
						"bank_id": 0,
						"url_image": ""
					}
				},
				"status": true
			}


			var url = data.card.Data.url_image;
			url = url.replace(/\\/g, "");
			data.card.Data.url_image = url;

			var type = data.card.Data.type;
			type = capitalizeFirstLetter(type);
			data.card.Data.type = type;

			var address = data.card.Data.address;
			address = address.replace("BOGOTA","");
			address = address.replace("BOGOTÁ","");
			address = address.replace("Bogotá","");
			address = address.replace("Bogota","");
			address = address.replace("COLOMBIA","");
			address = address.replace("COlOMBIA","");
			address = address.replace("Colombia","");
			data.card.Data.address = address;

			var name = data.card.Data.name;
			name = toTitleCase(name);
			data.card.Data.name = name;

			var message_json = {
				"who":"mibank",
				"showavatar":showAvatar,
				"value":data.card.Data,
				"type":"card"
			};
			$scope.messages.push(message_json);
			$scope.sizeOfContent += 252;

		}

		function appendUserMessage(message, showAvatar){
			var message = {
				"who":"user",
				"showavatar":showAvatar,
				"value":message
			};
			$scope.messages.push(message);
			$scope.sizeOfContent += 60;
			//$scope.scrollable = false;

			if($scope.sizeOfContent > 450){
				jQuery(".chat-wrapper").css("bottom","initial");
			}
			//jQuery(".scroll-content").scrollTop(10000);

			setTimeout(function(){ 
				jQuery(".scroll-content").scrollTop(1000);
			},400);
		}

		function appendBotTextMessage(message, showAvatar){
			var message_json = {
				"who":"mibank",
				"showavatar":showAvatar,
				"value":message,
				"type":"text"
			};
			$scope.messages.push(message_json);
			$scope.sizeOfContent += 70;
		}

		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

		function sendTextMessage(message, lat, long){
			var json_data = {
				"text":$scope.input.chat,
				"lat":lat+'',
				"lng":long+''
			};
			console.log("this is the data being sent:");
			console.log(json_data);

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
				if (data.status){
					appendBotTextMessage("La sucursal más cerca está en Viva Palmas. Mira te mostramos más información:", true);
					appendATMCard(data,false);
				}else{
					appendBotTextMessage("Lo siento, cada día me entreno para ser mejor, pero esta vez no sé responder esa pregunta. :(", true);

				}

			}).
			error(function(data, status, headers, config) 
			{
				console.log("error");
				console.log(data);
			});
		}

	});
