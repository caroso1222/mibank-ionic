angular.module('starter.controllers')

.controller('TourCtrl', function($scope, $rootScope, $http, $state, $stateParams) {
	console.log("getting this name from params:");
	console.log($stateParams.firstName);

	$scope.firstName = $stateParams.firstName;

	$scope.registrarCliente = function(){
		console.log("signin up...");

		var json_data = {
			"FirstName":"Carlos",
			"Email":"ce.roso398@gmail.com",
			"LastName":"Roso"
		};

		var req = {
			method: 'POST',
			url: 'http://104.236.93.10:8000/api/v1/user/register',
			data: json_data,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}
		$http(req).
		success(function(data, status, headers, config) 
		{
			console.log("success");
			console.log(data);
		}).
		error(function(data, status, headers, config) 
		{	
			console.log("error");
			console.log(data);
		});
	}

		$scope.goToChat = function(){
			console.log("goign to chat");
			$state.go("chat",{firstName:$stateParams.firstName});
		}

// 	$http.get('https://cors-test.appspot.com/test').then(function(resp) {
// 		console.log('Success', resp);
//     // For JSON responses, resp.data contains the result
// }, function(err) {
// 	console.error('ERR', err);
//     // err.status will contain the status code
// });

});