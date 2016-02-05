angular.module('homApp.controllers', [])

.controller('LandingCtrl', ['$scope', '$state', 'UserService', 'RoomService', function($scope, $state, UserService, RoomService) {
	$scope.doSignUpAction = function() {
		$state.go('signup');
	};

	$scope.doSignInAction = function() {
		$state.go('signin');
	};

	RoomService.getHomeData().then(function(home) {
	});
}])

.controller('SignUpCtrl', ['$scope', '$state', '$ionicLoading', '$rootScope', 'UserService', function($scope, $state, $ionicLoading, $rootScope, UserService) {
  // ng-model holding values from view/html
  $scope.isSignUpBtnDisabled = false;
  $scope.creds = {};

  $scope.doSignUpAction = function() {
	  $ionicLoading.show({
		  template: 'Signing up...'
	  });
	  $scope.isSignUpBtnDisabled = true;
	  UserService.init();
	  UserService.createUser($scope.creds).then(function (_data) {
		  $rootScope.first_name = $scope.creds.first_name;
		  $ionicLoading.hide();
		  $scope.user = _data;
		  $state.go('setup-scan');
		  }, function (_error) {
			  $ionicLoading.hide();
			  alert("Error Creating User Account " + _error.debug);
			  $scope.isSignUpBtnDisabled = false;
	  });
  };

  $scope.doGoBackAction = function() {
	  $state.go('landing');
  };

}])

.controller('SignInCtrl', ['$scope', '$state', '$ionicLoading', '$rootScope', 'UserService', function($scope, $state, $ionicLoading, $rootScope, UserService) {
  // ng-model holding values from view/html
  $scope.isSignInBtnDisabled = false;
  $scope.creds = {};

  $scope.doSignInAction = function() {
	  $ionicLoading.show({
		  template: 'Signing in...'
	  });
	  $scope.isSignInBtnDisabled = true;
	  UserService.init();
	  UserService.login($scope.creds.email, $scope.creds.password).then(function (_response) {
		  $ionicLoading.hide();
		  $rootScope.first_name = _response.attributes.first_name;
		  $state.go('app.dashboard');
		  //alert("login success " + _response.attributes.username);
		  }, function (_error) {
			  $ionicLoading.hide();
			  alert("Error signing in " + _error.message);
			  $scope.isSignInBtnDisabled = null;
	  });
  };

  $scope.doSignOutAction = function() {
	  UserService.logout().then(function (_response) {
		  // transition to next state
		  $state.go('landing');
		  }, function (_error) {
			  alert("Error signing out " + _error.message);
	  });
  };
  
  $scope.doBackAction = function() {
	  $state.go('landing');
  };
  
  $scope.doForgotPasswordAction = function() {
  };

}])

.controller('DashboardCtrl', ['$scope', '$state', '$ionicSideMenuDelegate', 'UserService', 'RoomService', function($scope, $state, $ionicSideMenuDelegate, UserService, RoomService) {
	$scope.homeTitle = RoomService.getRoomTitle();
	var room;
	try {
		room = RoomService.getRoom(0);
	} catch (e) {
	}
	$scope.roomTitle = room ? room.title : "";
	$scope.thermostatValue = room ? (room.thermostatValue + "°") : "";
	$scope.scene = room ? room.scene : "";

	$scope.numOfLightsOn = RoomService.getNumOfLightsOn();
	$scope.numOfLocksLocked = RoomService.getNumOfLocksLocked();
	$scope.numOfCamerasOn = RoomService.getNumOfCamerasOn();
	
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	$scope.doSignInAction = function() {
		$state.go('signin');
	};
}])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, $rootScope, UserService) {
	$scope.first_name = $rootScope.first_name;
	$scope.doSignOutAction = function() {
	  UserService.logout().then(function (_response) {
		  // transition to next state
		  $state.go('landing');
		  }, function (_error) {
			  $state.go('landing');
			  alert("Error signing out " + _error.message);
	  });
  };	
})

.controller('RoomsCtrl', function($scope, $state, $ionicModal, $timeout, RoomService ) {
	$scope.rooms = RoomService.getRooms();
})

.controller('RoomDetailsCtrl', function($scope, $state, $ionicModal, $timeout, RoomService ) {
})

.controller('SetupScanCtrl', function($scope, $state, $ionicModal, $timeout, RoomService ) {
	$scope.navigateToSetupConnect = function() {
		$state.go('setup-connect');
	};
})

.controller('SetupConnectCtrl', function($scope, $state, $ionicModal, $timeout, RoomService ) {
	$scope.navigateToDashboard = function() {
		$state.go('app.dashboard');
	};
})

.controller('AddConnectCtrl', function($scope, $state, $ionicModal, $timeout, RoomService ) {
})

.controller('AddNewDeviceCtrl', function($scope, $state, $ionicModal, $timeout, RoomService ) {
})

.controller('LocksCtrl', function($scope, $state, $ionicModal, $timeout, RoomService ) {
})

.controller('LockDetailsCtrl', function($scope, $state, $ionicModal, $timeout, RoomService ) {
})
