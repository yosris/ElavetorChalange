(function () {
	angular.module('elev-chalange')
	 .directive('floor', ['$timeout', '$rootScope', 'liftService', function ($timeout, $rootScope, liftService) {
	 	return {
	 		restrict: 'E',
	 		templateUrl: '/components/floor/floor.html',
	 		link: function (scope, elem, attrs) {
	 			scope.floorNumber = attrs.floornumber;
	 			scope.timeToArrive = -1;

	 			function setLimitedInterval(startTime) {
	 				$timeout(function () {
	 					startTime--;
	 					scope.timeToArrive = startTime;
	 					scope.$apply();
	 					if (scope.timeToArrive > 0) {
	 						setLimitedInterval(startTime);
	 					}
	 					else {
	 						elem.find('.comingLift').hide();
	 					}

	 				}, 1000)
	 			}
				 

	 			elem.click(function () {
	 				console.log(attrs.floornumber);

	 				scope.comingLift = liftService.callToLift(attrs.floornumber, scope.$parent.buildingid);

	 				if (scope.comingLift < 0) {
	 					return;
	 				}

	 				elem.find('.number').css('color', 'green');
	 				scope.timeToArrive = -1;

	 				var startTime;

	 				var arrivalListener = $rootScope.$on('liftArrival' + scope.comingLift + scope.$parent.buildingid, function (event, data) {

	 					

	 					if (scope.timeToArrive < 0) {

	 						var positionInQueu;
	 						var estimateTime = 0;
	 						// calculation of arrival time
	 						// get the position of floor in the lift's queue
	 						for (var i = 0; i < data.callers.length; i++) {

	 							// evrey floor is 0.5 seconds
	 							estimateTime += (Math.abs(data.callers[i] - (i == 0 ? data.liftFloor : data.callers[i - 1])) * 0.5);

								// if it's the current floor
	 							if (data.callers[i] == scope.floorNumber) {
	 								positionInQueu = i;
	 								break;
	 							}

								// for evry lift stop, there is 2 seconds waite, and evrer floor is 0.5 seconds
	 							estimateTime += 2;
	 						}

	 						scope.timeToArrive = Math.floor(estimateTime);
	 						scope.$apply();

	 						// time for lift to get to it's next destination
	 						//scope.timeToArrive = Math.ceil(((data.timeToArrive - (data.timeToArrive % 1000)) / 1000) +
							//	// lift is wating for 2 seconds in each stop
							//	(positionInQueu ? positionInQueu * 2 : 0) +
							//	// lift takes 0.5 second for each floor
							//	(Math.abs(scope.floorNumber - data.liftFloor) * 0.5));

	 						setLimitedInterval(scope.timeToArrive);
	 					}
	 					else {
	 						//console.log('time to wait', data);
	 						elem.find('.comingLift').show();
	 					}


						// lift arrived
	 					if (scope.timeToArrive == 0) {
	 						elem.find('.comingLift').hide();
	 						elem.find('.number').css('color', 'black');

	 						// unsubscribe listener
	 						arrivalListener();

	 						liftService.liftArrivedHandler(attrs.floornumber, scope.comingLift);
	 					}
	 				});
	 			});

	 			
	 		}
	 	}
	 }]);
}())