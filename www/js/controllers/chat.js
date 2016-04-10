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
		$scope.activeGroup = 0;

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
				"value":data,
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

			var url = data.data.Data.url_image;
			url = url.replace(/\\/g, "");
			data.data.Data.url_image = url;

			var type = data.data.Data.type;
			type = capitalizeFirstLetter(type);
			data.data.Data.type = type;

			var address = data.data.Data.address;
			address = address.replace("BOGOTA","");
			address = address.replace("BOGOTÁ","");
			address = address.replace("Bogotá","");
			address = address.replace("Bogota","");
			address = address.replace("COLOMBIA","");
			address = address.replace("COlOMBIA","");
			address = address.replace("Colombia","");
			data.data.Data.address = address;

			var name = data.data.Data.name;
			name = toTitleCase(name);
			data.data.Data.name = name;

			var message_json = {
				"who":"mibank",
				"showavatar":showAvatar,
				"value":data.data.Data,
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

		function showGroup6(){
			var data = {
				"buttons":[
				{ "code":"1", "value":"Que alguien confiable me ayude" },
				{ "code":"3", "value":"Que no necesite moverme de donde estoy" }
				]	
			}
			appendMultioptionQuestion(data,false);
		}

		function showGroup8(){
			var data = {
				"buttons":[
				{ "code":"1", "value":"Que alguien confiable me ayude" },
				{ "code":"2", "value":"Que alguien me ayude ahorrando tiempo" },
				{ "code":"3", "value":"Que no necesite moverme de donde estoy" },
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

		function showGroup1(){
			var data = {
				"buttons":[
				{ "code":"1", "value":"Que alguien confiable me ayude" },
				{ "code":"2", "value":"Que alguien me ayude ahorrando tiempo" },
				{ "code":"3", "value":"Que no necesite moverme de donde estoy" },
				{ "code":"4", "value":"Solo necesito un cajero y ya" },
				]	
			}
			appendMultioptionQuestion(data,false);
		}


		function showGroup2(){
			var data = {
				"buttons":[
				{ "code":"1", "value":"Que alguien confiable me ayude" },
				{ "code":"3", "value":"Que no necesite moverme de donde estoy" }
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
			}else if (id == "3"){
				$scope.sizeOfContent += 400;
				appendBotTextMessage("Te entiendo, yo también prefiero no salir, además vivo dentro de tu celular. Las alternativas que puedes seleccionar son las siguientes:", true);
				var data = {};
				console.log("este es el active group");
				console.log($scope.activeGroup);
				if ($scope.activeGroup == 1){
					data = {
						"services":[
						{"code":"1", "value":"browser"},
						{"code":"2", "value":"android"},
						{"code":"3", "value":"iOS"},
						{"code":"4", "value":"phone"}
						]
					}
				}else if ($scope.activeGroup == 2){
					data = {
						"services":[
						{"code":"1", "value":"browser"},
						{"code":"4", "value":"phone"}
						]
					}
				}else if ($scope.activeGroup == 6){
					data = {
						"services":[
						{"code":"1", "value":"browser"},
						{"code":"2", "value":"android"},
						{"code":"3", "value":"iOS"},
						{"code":"4", "value":"phone"}
						]
					}
				}else if ($scope.activeGroup == 8){
					data = {
						"services":[
						{"code":"1", "value":"browser"}
						]
					}
				}
				appendECard(data,false);
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
				if (data.status && "Data" in data.message.data){
					if(data.message.data.Data.type == "oficina"){
						appendBotTextMessage("Ya sabemos lo que necesitas. Encontramos una sucursal muy cerca a tu ubicación, puede que te sirva:", showavatar);
					}else if(data.message.data.Data.type == "cajero"){
						appendBotTextMessage("Encontramos un cajero cercano. Mira, te mostramos más información:", showavatar);
					}else{
						appendBotTextMessage("Encontré un corresponsal cercano. Te conseguí más información, mira:", showavatar);
					}
					appendATMCard(data.message,false);
				}else{

					var group6 = ((message.match(/cheque/i)) ? true : false);
					group6 = group6 || ((message.match(/inscripci/i)) ? true : false);
					group6 = group6 || ((message.match(/inscrib/i)) ? true : false);
					group6 = group6 || ((message.match(/alert/i)) ? true : false);
					group6 = group6 || ((message.match(/notifica/i)) ? true : false);
					group6 = group6 || ((message.match(/bloque/i)) ? true : false);
					group6 = group6 || ((message.match(/modific/i)) ? true : false);

					var group2 = ((message.match(/elimin/i)) ? true : false);
					group2 = group2 || ((message.match(/borr/i)) ? true : false);
					group2 = group2 || ((message.match(/solicit/i)) ? true : false);
					group2 = group2 || ((message.match(/apertur/i)) ? true : false);
					group2 = group2 || ((message.match(/abr/i)) ? true : false);
					group2 = group2 || ((message.match(/desembols/i)) ? true : false);
					group2 = group2 || ((message.match(/activar/i)) ? true : false);
					group2 = group2 || ((message.match(/actualiz/i)) ? true : false);

					var group1 = ((message.match(/consult/i)) ? true : false);
					group1 = group1 || ((message.match(/pagar/i)) ? true : false);
					group1 = group1 || ((message.match(/transfer/i)) ? true : false);
					group1 = group1 || ((message.match(/transfier/i)) ? true : false);
					group1 = group1 || ((message.match(/move/i)) ? true : false);
					group1 = group1 || ((message.match(/pasa/i)) ? true : false);
					group1 = group1 || ((message.match(/pasó/i)) ? true : false);

					var group5 = ((message.match(/retir/i)) ? true : false);
					group5 = group5 || ((message.match(/sacar/i)) ? true : false);

					var group4 = ((message.match(/deposit/i)) ? true : false);
					group4 = group4 || ((message.match(/depósit/i)) ? true : false);
					group4 = group4 || ((message.match(/consign/i)) ? true : false);

					var group7 = ((message.match(/cancel/i)) ? true : false);
					group7 = group7 || ((message.match(/termin/i)) ? true : false);

					var group3 = ((message.match(/recarg/i)) ? true : false);

					var group8 = ((message.match(/avance/i)) ? true : false);
					
					if(group5){
						$scope.activeGroup = 5;
						appendBotTextMessage("Oh quieres retirar dinero! :O", true);
						showGroup5();
					}else if (group4){
						$scope.activeGroup = 4;
						appendBotTextMessage("OK "+ $stateParams.firstName +", según entiendo, quieres hacer una consignación. ¿Cómo quisieras proceder?", true);
						showGroup4();
					}else if (group7){
						$scope.activeGroup = 7;
						appendBotTextMessage("Lo mejor para este tipo de operaciones es acercase directamente a una oficina.", true);
						sendTextMessage("oficina",$scope.currentLat,$scope.currentLong, false);
					}else if (group1){
						$scope.activeGroup = 1;
						appendBotTextMessage($stateParams.firstName +" para esto que necesitas tienes varias alternativas. Por favor selecciona la que mejor se ajusta para ti", true);
						showGroup1();
					}else if (group2){
						$scope.activeGroup = 2;
						appendBotTextMessage("OK. Pues, las operaciones de apertura, eliminaciones y actualizaciones es mejor hacerlas en sucursales o en línea. Por favor selecciona lo que prefieras.", true);
						showGroup2();
					}else if (group3){
						$scope.activeGroup = 3;
						appendBotTextMessage("Bueno "+ $stateParams.firstName +", mi recomendación para las operaciones de recarga es que lo hagas por medio de la línea telefónica. Ya te doy más detalles." , true);
						data = {
							"services":[
							{"code":"4", "value":"phone"}
							]
						}	
						appendECard(data,false);
					}else if (group6){
						$scope.activeGroup = 6;
						appendBotTextMessage("Entiendo tu pregunta. Ahora cuéntame un poco más para dar una solución adecuada.", true);
						showGroup6();
					}else if (group8){
						$scope.activeGroup = 8;
						appendBotTextMessage("Todo lo relacionado con avances puedes manejarlo por muchos canales. Dime con cuál de las siguientes opciones te sientes mejor.", true);
						showGroup8();
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
