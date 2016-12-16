angular.module('app').component("whereList",{
bindings:{
	data:'=',
	whereList:'=',
	orderList:'=',
	callback:'=',
},
templateUrl:'app/components/whereList/whereList.html?t='+Date.now(),
controller:["$scope",function($scope){
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
		// console.log($scope.$ctrl.data.field)
		$scope.$watch("$ctrl.whereList",function(){
			$scope.$ctrl.callback();
		},1)	
		$scope.$watch("$ctrl.orderList",function(){
			$scope.$ctrl.callback();
		},1)
	};	
	
	$scope.add_where_list=function(item){
		var item=angular.copy(item);
		var index=$scope.$ctrl.whereList.findIndex(function(val){
			return 	val.field==item.field && val.type==item.type && val.value==item.value
		})
		
		if(index==-1){
			$scope.$ctrl.whereList.push(item);
		}
	}
	
	$scope.add_order_list=function(item){
		var item=angular.copy(item);
		var index=$scope.cache.order_list.findIndex(function(val){
			return 	val.field==item.field 
		})
		
		if(index==-1){
			$scope.cache.order_list.push(item);
		}else{
			$scope.cache.order_list[index].type=item.type
		}
	}
	
	
	
}],
})