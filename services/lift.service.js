(function(){
angular.module('elev-chalange')
	.service('liftService', ['$rootScope', function ($rootScope) {

	    this.callersArr = [];
	    this.liftsArr = [];

        // init 
	    function init(lifts) {
	        this.liftsArr = lifts;
	        this.callersArr = [];
	    }

	    function callToLift(floorNumber, buildingId) {

	        // check that caller is not already in array
	        if (this.callersArr.includes(floorNumber)) {
	            return;
	        }

	        // if not, push it to the end of the 'queue'
	        this.callersArr.push(floorNumber);

	        // first, check for availabe lift.
	        var lift = getAvailableLift(this.liftsArr, floorNumber);
	        if (!lift) {
	            // if there is no available lift, get the nearest one 
	            // and push it the lift's queue
	            lift = getNearestLift(this.liftsArr, floorNumber, true);
	        }

	        if (lift) {
	            lift.callers.push(floorNumber);
	            // call for the first one
	            //if (lift.callers.length == 1) {
	            $rootScope.$emit('callLift' + lift.id + buildingId, floorNumber);
	            //}
	            
	            return lift.id;
	        }

	        return -1;
	        

	        // if there is not any, need to push it the lift's queue.
	        // which lift?
	        // the one with the shortest queue
	        // and the one that is the closest AFTER the last one in queue
	    }

	    function liftArrivedHandler(floorNumber, liftId) {
	        var index = this.callersArr.indexOf(floorNumber);
	        this.callersArr.splice(index, 1);

	        var liftArrived = getLiftById(liftId, this.liftsArr);
	        if (liftArrived) {
	            //index = liftArrived.callers.indexOf(floorNumber);
	            //liftArrived.callers.splice(index, 1);

	            if (liftArrived.callers.length == 0) {
	                liftArrived.movmentStatus = 0;
	            }
	        }
	    }

	    function getLiftById(liftId, lifts) {
	        if (!lifts)
	            return;

	        var lift = lifts.filter(function (item) { return item.id === liftId; });
	        if (lift.length > 0) {
	            return lift[0];
	        }
	    }
         
        
	    function getAvailableLift(liftsArr, floorToGo) {
	        var lift, availableLift, nearestInterval;
	        for (var i = 0; i < liftsArr.length; i++) {
	            lift = liftsArr[i]
	            if (lift.movmentStatus == 0) {

	                // get the nearest lift there is to the caller
	                var interval = Math.abs(lift.currentFloor - floorToGo);
	                if (!nearestInterval || interval < nearestInterval) {
	                    nearestInterval = interval;
	                    availableLift = lift;
	                }
	            }
	        }

	        return availableLift;
	    }

	    function getNearestLift(liftsArr, floorToGo) {
	        var lift, availableLift, nearestInterval;
	        for (var i = 0; i < liftsArr.length; i++) {
	            lift = liftsArr[i]
	            if (lift.callers.length > 0) {
	                // get last caller
	                var callerFloor = lift.callers[lift.callers.length - 1];

	                // get the closest lift there is to the caller
	                var interval = Math.abs(callerFloor - floorToGo);
	                if (!nearestInterval || interval < nearestInterval) {
	                    nearestInterval = interval;
	                    availableLift = lift;
	                }
	            }
	        }

	        return availableLift;
	    }

	    function updateCurrenFloor(currentFloor, liftId) {
	        var lift = getLiftById(liftId, this.liftsArr);
	        if (lift) {
	            lift.currentFloor = currentFloor;
	        }
	    }

	    return {
            init: init,
            callToLift: callToLift,
            liftArrivedHandler: liftArrivedHandler,
            updateCurrenFloor: updateCurrenFloor
	    }
	}])
}())
