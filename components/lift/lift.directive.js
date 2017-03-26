(function(){
    angular.module('elev-chalange')
	 .directive('lift', ['$timeout', '$rootScope', 'liftService', function ($timeout, $rootScope, liftService) {
	 	return {
	 		restrict: 'E',
	 		templateUrl: '/components/lift/lift.html',
	 		link: function (scope, elem, attrs) {

	 		    var $slider = $(".lift-slider-vertical").last();

	 		    scope.currentFloor = 0;
	 		    scope.calles = [];

	 		    $slider.slider({
	 				// TODO: max: attrs.floorsCount
	 				orientation: "vertical"
	 		    })

	 		    // init
	 		    $slider.slider({
	 		        value: 0
	 		    })

	 		    $rootScope.$on('callLift' + scope.lft.id + scope.$parent.buildingid, function (event, data) {
	 		        console.log('scope.lft.callers', scope.lft.callers);
	 		        scope.calles.push(data);
	 		        if (scope.calles.length == 1) {
	 		            move(data);
	 		        }
	 		    });

	 		    function callHandler(destination) {
	 		        var status = scope.lft.movmentStatus;
	 		        if (status == 4) {
                        // out of order
	 		            return;
	 		        }
	 		    }
	 		
	 		    function move(destination) {
	 		        
	 		        var floorsToGo = destination - scope.currentFloor;

	 		        scope.lft.movmentStatus = (floorsToGo > 0) ? 1 : 2;

	 		        var floorPercent = 100 / Math.abs(floorsToGo);
	 		        var startFloor = scope.currentFloor;
	 		        var duration = Math.abs(floorsToGo) * 500
	 		        $slider.animate({
	 		            bottom: destination * 90
	 		        },
                    {
                        progress: function (a, p, c) {
                            //console.log('p', p);
                            // percent
                            var progressPercent = p * 100;
                            var floorsProg = parseInt(progressPercent / floorPercent);
                            scope.currentFloor = (floorsToGo > 0) ? (startFloor + floorsProg) : (startFloor - floorsProg);
                            liftService.updateCurrenFloor(scope.currentFloor, scope.lft.id);

                            var data = { timeToArrive: c, callers: scope.calles, liftFloor: scope.currentFloor }

                            $rootScope.$emit('liftArrival' + scope.lft.id + scope.$parent.buildingid, data);
                        },
                        duration: duration,
                        complete: function () {
                            var audio = new Audio('/components/lift/ding.mp3');
                            audio.play();

                            // TODO: go to the next one (if there is)
                            console.log('finish', scope.calles);

                            // remove the first caller
                            scope.calles.splice(0, 1);

                            if (scope.calles.length > 0) {
                                $timeout(function () {
                                    move(scope.calles[0])
                                }, 2000);
                            }
                            else {
                                scope.lft.movmentStatus = 0;
                            }
                        }
                    })
	 		    }

                
	 		}
	 	}
	 }]);
}())