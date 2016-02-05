angular.module('homApp.services', [])
.service('UserService', ['$q', 'ParseConfig',
	function ($q, ParseConfig) {
		var parseInitialized  = false;
		return {
			/**
			 *
			 * @returns {*}
			 */
			init: function () {
				// if initialized, then return the activeUser
				if (parseInitialized === false) {
					Parse.initialize(ParseConfig.APPLICATION_ID, ParseConfig.JAVA_SCRIPT_KEY);
					parseInitialized = true;
					console.log("parse initialized in init function");
				}

				var currentUser = Parse.User.current();
				if (currentUser) {
					return $q.when(currentUser);
				} else {
					return $q.reject({error: "noUser"});
				}
			},
			/**
			 *
			 * @param _userParams
			 * @returns {Promise}
			 */
			createUser: function (_userParams) {
				var user = new Parse.User();
				user.set("username", _userParams.email);
				user.set("password", _userParams.password);
				user.set("email", _userParams.email);
				user.set("first_name", _userParams.first_name);
				user.set("last_name", _userParams.last_name);

				// should return a promise
				return user.signUp(null, {});
			},
			/**
			 *
			 * @param _parseInitUser
			 * @returns {Promise}
			 */
			currentUser: function (_parseInitUser) {
				// if there is no user passed in, see if there is already an
				// active user that can be utilized
				_parseInitUser = _parseInitUser ? _parseInitUser : Parse.User.current();

				console.log("_parseInitUser " + Parse.User.current());
				if (!_parseInitUser) {
					return $q.reject({error: "noUser"});
				} else {
					return $q.when(_parseInitUser);
				}
			},
			/**
			 *
			 * @param _user
			 * @param _password
			 * @returns {Promise}
			 */
			login: function (_user, _password) {
				return Parse.User.logIn(_user, _password);
			},
			/**
			 *
			 * @param _callback
			 * @returns {Promise}
			 */
			logout: function (_callback) {
				var defered = $q.defer();
				Parse.User.logOut();
				defered.resolve();
				return defered.promise;
			}
		}
}])

.factory('RoomService', ['$http', 'ServerConfig', function($http, ServerConfig) {
	var home = {};

	return {
		getHomeData: function() {
			return $http.get(ServerConfig.HOME_CONFIG_DATA_URL).then(function(response) {
				home = response.data.home;
				return home;
			});
		},
		getHome: function() {
			return home;
		},
		getRoom: function(index) {
			return home.rooms[index];
		},
		getRooms: function() {
			return home.rooms;
		},
		getRoomTitle: function() {
			return home && home.title ? home.title : "";
		},
		getNumOfLightsOn: function() {
			var count = 0;
			var roomsLen = home && home.rooms ? home.rooms.length : 0;
			for(var i = 0; i < roomsLen; i++) {
				var roomLightsLen = home.rooms[i] && home.rooms[i].lights ? home.rooms[i].lights.length : 0;
				var numOfLightsOn = 0;
				for(var j = 0; j < roomLightsLen; j++) {
					if(home.rooms[i].lights[j] && home.rooms[i].lights[j].status === 1) {
						count++;
						numOfLightsOn++;
					}
				}
				home.rooms[i].numOfLightsOn = home.rooms[i] ? numOfLightsOn : 0;
			}
			return count;
		},
		getNumOfLocksLocked: function(index) {
			var count = 0;
			var roomsLen = home && home.rooms ? home.rooms.length : 0;
			for(var i = 0; i < roomsLen; i++) {
				var roomLocksLen = home.rooms[i] && home.rooms[i].locks ? home.rooms[i].locks.length : 0;
				for(var j = 0; j < roomLocksLen; j++) {
					if(home.rooms[i].locks[j] && home.rooms[i].locks[j].status === 1)
						count++;
				}
			}
			return count;
		},
		getNumOfCamerasOn: function(index) {
			var count = 0;
			var roomsLen = home && home.rooms ? home.rooms.length : 0;
			for(var i = 0; i < roomsLen; i++) {
				var roomCamerasLen = home.rooms[i] && home.rooms[i].cameras ? home.rooms[i].cameras.length : 0;
				var numOfCamerasOn = 0;
				for(var j = 0; j < roomCamerasLen; j++) {
					if(home.rooms[i].cameras[j] && home.rooms[i].cameras[j].status === 1) {
						count++;
						numOfCamerasOn++;
					}
				}
				home.rooms[i].numOfCamerasOn = home.rooms[i] ? numOfCamerasOn : 0;
			}
			return count;
		}
	}
}]);
