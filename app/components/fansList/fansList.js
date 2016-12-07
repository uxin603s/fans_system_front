angular.module('app').component("fansList",{
bindings:{
},
templateUrl:'app/components/fansList/fansList.html?t='+Date.now(),
controller:["$scope",function($scope){
	// total_count
	// limit_page
	// limit_count
	
	$scope.status_arr={
		0:"下架",
		1:"上架",
		2:"申訴",
	}
	
	$scope.cache.where_list || ($scope.cache.where_list=[]);
	$scope.cache.limit || ($scope.cache.limit={page:0,count:10,total_count:0});
	
	
	
	$scope.get=function(){
		clearTimeout($scope.get_timer);
		$scope.get_timer=setTimeout(function(){
			console.log('get')
			
			var post_data={
				func_name:"FansList::getList",
				arg:{
					where_list:$scope.cache.where_list,
					limit:$scope.cache.limit,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.list=res.list
				}else{
					$scope.list=[];
				}
				$scope.cache.limit.total_count=res.total_count;
				
				$scope.$apply();
			},"json")
			
		},0)
		
	}
	
}],
})