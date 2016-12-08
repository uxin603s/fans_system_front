angular.module("app").directive("pagnation",[function() {
    return {
		templateUrl: 'app/directives/pagnation/pagnation.html?t='+Date.now(),
		restrict: 'E',
		replace:true,
		scope:{
			data:'=',
			callback:'=',
		},
        link: function($scope,$element,$attr) {
			var wacth_page_arr=function(){
				clearTimeout($scope.wacth_page_arr_timer);
				$scope.wacth_page_arr_timer=setTimeout(function(){
					if($scope.data.count==0){
						$scope.page_arr=[];
					}else{
						$scope.page_count=Math.ceil($scope.data.total_count/$scope.data.count);
						var page_arr=[];
						for(var i=0;i<$scope.page_count;i++){
							page_arr.push(i);
						}
						$scope.page_arr=page_arr;
					}
					if($scope.data.page>$scope.page_count){
						$scope.data.page=0;
					}
					$scope.$apply();
				},0)
			}
			$scope.$watch('data.total_count',wacth_page_arr);
			$scope.$watch('data.page',function(value){				
				if(isNaN(value))return;
				$scope.tmp_page=value*1+1
				$scope.page_start=$scope.data.page-3;				
				$scope.page_end=$scope.data.page+3;
				if($scope.page_start < 0){
					$scope.page_end-=$scope.page_start;
				}
				if($scope.page_end > $scope.page_count){
					$scope.page_start-=$scope.page_end-$scope.page_count;
				}
				
				$scope.callback && $scope.callback();
			});
			
			$scope.tmp_page_func=function(){
				if($scope.tmp_page*1<=0){
					$scope.tmp_page=1
				}else if($scope.tmp_page*1>$scope.page_count-1){
					$scope.tmp_page=$scope.page_count
				}
				$scope.data.page=$scope.tmp_page-1;
			}
			
			$scope.tmp_count_func=function(){
				$scope.data.count=$scope.tmp_count;
			}
			
			$scope.$watch('data.count',function(value){
				if(!value)return;
				$scope.tmp_count=value;
				
				wacth_page_arr();
				$scope.callback && $scope.callback();
			});

        },
    }
}]);