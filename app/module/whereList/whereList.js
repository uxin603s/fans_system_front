angular.module('whereList',[])
.factory('whereListFunc',['$rootScope',function($rootScope){
	var add_where_list=function(list,item,replace){
		var item=angular.copy(item);
		if(replace){
			var index=list.findIndex(function(val){
				return 	val.field==item.field && val.type==item.type
			})
			
			if(index==-1){
				list.push(item);
			}else{
				list[index].value=item.value;
			}
		}else{
			var index=list.findIndex(function(val){
				return 	val.field==item.field && val.type==item.type && val.value==item.value
			})
			
			if(index==-1){
				list.push(item);
			}
		}
		
	}
	
	var add_order_list=function(list,item,replace){
		var item=angular.copy(item);
		var index=list.findIndex(function(val){
			return 	val.field==item.field;
		})
		
		if(index==-1){
			list.push(item);
		}else{
			list[index].type=item.type
		}
	}	
	return {
		add_where_list:add_where_list,
		add_order_list:add_order_list,
	}
}])
.component("whereList",{
bindings:{
	data:'=',
	whereList:'=',
	orderList:'=',
	callback:'=',
},
templateUrl:'app/module/whereList/whereList.html?t='+Date.now(),
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
