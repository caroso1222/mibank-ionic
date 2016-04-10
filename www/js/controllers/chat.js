	angular.module('starter.controllers')
	//angular.module('starter.controllers', ['starter.services'])
	// .controller('SessionsCtrl',function($scope, Session){
	//   $scope.sessions = Session.query();
	// })

	// .controller('SessionCtrl',function($scope, $stateParams, Session){
	//   $scope.session = Session.get({sessionId: $stateParams.sessionId});
	// })

	.controller('ChatCtrl', function($scope, $ionicPlatform, $rootScope, $http, $cordovaGeolocation, $stateParams, $cordovaInAppBrowser) {
	//	.controller('ChatCtrl', function($scope, $ionicPlatform, $rootScope, $http, $cordovaGeolocation, $stateParams) {
		$scope.messages = [];
		console.log("chat ctrl loaded");
		appendBotTextMessage("Hola "+ $stateParams.firstName +"! Pregúntame lo que quieras.",true);
		console.log("this is the name");
		console.log($stateParams.firstName);
		//appendECard("shidf",false);

		//appendMultioptionQuestion(false);
		//appendUserMessage("Hola",true);

		$scope.sizeOfContent = 0;
		$scope.scrollable = false;
		$scope.currentLat = "";
		$scope.currentLong = "";

		var options = {
			location: 'yes',
			clearcache: 'yes',
			toolbar: 'no'
		};

		$ionicPlatform.ready(function() {
			$scope.openPlayStore = function(){
				$cordovaInAppBrowser.open('https://play.google.com/store/apps/details?id=com.todo1.mobile&hl=es_419', '_blank', options);
			}
			$scope.openIOSStore = function(){
				$cordovaInAppBrowser.open('https://itunes.apple.com/co/app/bancolombia-app/id565101003?mt=8', '_blank', options);
			}
			$scope.openSucursal = function(){
				$cordovaInAppBrowser.open('http://www.grupobancolombia.com/wps/portal/personas/productos-servicios/canales-servicio/sucursal-web/sucursal-virtual-personas/', '_blank', options);
			}
		});


		$scope.newUserMessage = function(){
			if($scope.input.chat != ""){
				appendUserMessage($scope.input.chat, true);
				var posOptions = {timeout: 10000, enableHighAccuracy: false};
				$cordovaGeolocation
				.getCurrentPosition(posOptions)
				.then(function (position) {
					var lat  = position.coords.latitude;
					var long = position.coords.longitude;
					$scope.currentLat = lat + "";
					$scope.currentLong = long+ "";
					sendTextMessage($scope.input.chat,lat,long, true);
					$scope.input.chat = "";	
				}, function(err) {
					console.log("theres an error");
				});
			}
		}

		function appendMultioptionQuestion(data,showAvatar){
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
				"value":data.buttons,
				"type":"multioption"
			};
			$scope.messages.push(message_json);
			$scope.sizeOfContent += 252;
		}

		function appendECard(data,showAvatar){
			var messageReceived = {
				"services":[
				{"code":"1", "value":"browser"},
				{"code":"2", "value":"android"},
				{"code":"3", "value":"iOS"},
				{"code":"4", "value":"phone"}
				]
			}
			var message_json = {
				"who":"mibank",
				"showavatar":showAvatar,
				"value":messageReceived,
				"type":"eCard"
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

		function showGroup5(){
			var data = {
				"buttons":[
				{ "code":"1", "value":"Que alguien confiable me ayude" },
				{ "code":"2", "value":"Que alguien me ayude ahorrando tiempo" },
				{ "code":"4", "value":"Solo quiero un cajero y ya" }
				]	
			}
			appendMultioptionQuestion(data,false);
		}


		function showGroup4(){
			var data = {
				"buttons":[
				{ "code":"1", "value":"Que alguien confiable me ayude" },
				{ "code":"2", "value":"Que alguien me ayude ahorrando tiempo" }
				]	
			}
			appendMultioptionQuestion(data,false);
		}

		$scope.sendMultioption = function(id){
			console.log("go for it");
			if (id == "1"){
				sendTextMessage("oficina",$scope.currentLat,$scope.currentLong, false);
			}else if (id == "2"){
				sendTextMessage("corresponsal",$scope.currentLat,$scope.currentLong, false);
			}else if (id == "4"){
				sendTextMessage("cajero",$scope.currentLat,$scope.currentLong, false);
			}
		}

		function sendTextMessage(message, lat, long, showavatar){
			var json_data = {
				"text":message,
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
					if(data.card.Data.type == "oficina"){
						appendBotTextMessage("Ya sabemos lo que necesitas. Encontramos una sucursal muy cerca a tu ubicación, puede que te sirva:", showavatar);
					}else{
						appendBotTextMessage("Encontramos un cajero cercano. Mira, te mostramos más información:", showavatar);
					}
					appendATMCard(data,false);
				}else{
					var group5 = ((message.match(/retir/i)) ? true : false);
					group5 = group5 || ((message.match(/sacar/i)) ? true : false);

					var group4 = ((message.match(/deposit/i)) ? true : false);
					group4 = group4 || ((message.match(/depósit/i)) ? true : false);
					group4 = group4 || ((message.match(/consign/i)) ? true : false);


					var group7 = ((message.match(/cancel/i)) ? true : false);
					group7 = group7 || ((message.match(/termin/i)) ? true : false);
					
					if(group5){
						appendBotTextMessage("Oh quieres retirar dinero! :O", true);
						showGroup5();
					}else if (group4){
						appendBotTextMessage("OK "+ $stateParams.firstName +", según entiendo, quieres hacer una consignación. ¿Cómo quisieras proceder?", true);
						showGroup4();
					}else if (group7){
						appendBotTextMessage("Lo mejor para este tipo de operaciones es acercase directamente a una oficina.", true);
						sendTextMessage("oficina",$scope.currentLat,$scope.currentLong, false);
					}else{
						appendBotTextMessage("Lo siento, cada día me entreno para ser mejor, pero esta vez no podré responder esa pregunta. :(", true);

					}

				}

			}).
			error(function(data, status, headers, config) 
			{
				console.log("error");
				console.log(data);
			});
		}

	});
