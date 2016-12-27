angular.module('app').component("whereList",{
bindings:{
	data:'=',
	whereList:'=',
	orderList:'=',
	callback:'=',
},
templateUrl:'app/components/whereList/whereList.html?t='+Date.now(),
controller:["$scope","whereListFunc",function($scope,whereListFunc){
	$scope.where_list_type_arr=["等於","不等於","包含","不包含","大於","小於",];
	$scope.order_list_type_arr=["↑","↓"];
	$scope.fieldName={};
	$scope.fieldNameR={};
	this.$onInit = function () {
		for(var i in $scope.$ctrl.data.field){
			var enName=$scope.$ctrl.data.field[i].enName;
			$scope.fieldName[i]=enName;
			$scope.fieldNameR[enName]=i;
		}
		$scope.$watch("$ctrl.whereList",function(){
			$scope.$ctrl.callback();
			$scope.add_where_list=whereListFunc.add_where_list.bind(this,$scope.$ctrl.whereList);
		},1)	
		$scope.$watch("$ctrl.orderList",function(){
			$scope.$ctrl.callback();
			$scope.add_order_list=whereListFunc.add_order_list.bind(this,$scope.$ctrl.orderList)
		},1)
	};		
	
}],
})