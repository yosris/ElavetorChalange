(function () {
    function Lift(id) {
        this.currentFloor = 0;

        // 0 - stand by
        // 1 - moves up
        // 2 - moves down
        // 3 - out of order
        this.movmentStatus = 0;

        this.callers = [];

        this.id = id;
    }

    function Floor(number) {
        this.number = number;
    }

    angular.module('elev-chalange')
	 .directive('building', ['$timeout', 'liftService', function ($timeout, liftService) {
	     return {
	         restrict: 'E',
	         templateUrl: '/components/building/building.html',
	         scope:{
	             numberoffloors: '@',
	             numberoflifts: '@',
	             buildingid: '@'
	         },
	         link: function (scope, elem, attrs) {
	             
	             scope.floors = [];
	             scope.lifts = [];

	             //scope.numberOfFloors = parseInt(attrs.numberoffloors);
	             //scope.numberOfLifts = parseInt(attrs.numberoflifts);
	             //scope.buildingId = attrs.buildingid;
	             
	             for (var i = 0; i < scope.numberoffloors; i++) {
	                 scope.floors.push(new Floor(i));
	             }

	             for (var i = 0; i < scope.numberoflifts; i++) {
	                 scope.lifts.push(new Lift(i));
	             }

	             liftService.init(scope.lifts);

	         }
	     }
	 }]);
}())