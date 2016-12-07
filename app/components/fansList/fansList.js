angular.module('app').component("fansList",{
bindings:{
},
templateUrl:'app/components/fansList/fansList.html?t='+Date.now(),
controller:["$scope",
function($scope){
	$scope.status_arr={
		0:"下架",
		1:"上架",
		2:"申訴",
	}
	var post_data={
		func_name:"FansList::getList",
		arg:{
			where_list:$scope.where_list,
			limit:{page:0,count:10},
		},
	}
	$.post("ajax.php",post_data,function(res){
		if(res.status){
			$scope.list=res.list
		}else{
			$scope.list=[];
		}
		$scope.$apply();
	},"json")
}],
})