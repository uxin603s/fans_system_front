angular.module('app').component("fansList",{
bindings:{},
templateUrl:'app/components/fansList/fansList.html?t='+Date.now(),
controller:["$scope","whereListFunc","tagSystem",function($scope,whereListFunc,tagSystem){
	
	$scope.fieldStruct={
		field:[
			{
				enName:'status',
				name:"狀態",
				list:[
					{id:0,name:"下架",},
					{id:1,name:"上架",},
					{id:2,name:"申訴",},
					{id:3,name:"停權",},
				],
			},
			{
				enName:'fan_count',
				name:"粉絲數量",
			},
			{
				enName:'last_post_time_int',
				name:"最後PO文時間",
			},
			{
				enName:'id',
				name:"id",
			},
			{
				enName:'fb_id',
				name:"FB ID",
			},
			{
				enName:'comment',
				name:"註記",
			},
			{
				enName:'name',
				name:"名稱",
			}
		],
		order:['fan_count'],
		default:{
			where:{field:'status',type:"0"},
			order:{field:'fan_count',type:"0"},
		}
	}
	
	/*-----------------------*/
	$scope.cache.where_list || ($scope.cache.where_list=[{field:'status',type:0,value:1}]);
	$scope.cache.limit || ($scope.cache.limit={page:0,count:10,total_count:0});
	$scope.cache.order_list || ($scope.cache.order_list=[{field:'fan_count',type:1}]);
	
	$scope.$watch("cache.order_list",function(value){
		$scope.control_order=value.find(function(val){
			return val.field=="fan_count";
		})
	},1)
	$scope.$watch("cache.where_list",function(value){
		$scope.control_where=value.find(function(val){
			return val.field=="status";
		})
	},1)
	
	$scope.get=function(){
		$scope.list=[];
		$scope.message="查詢中...";
		clearTimeout($scope.get_timer);
		$scope.get_timer=setTimeout(function(){
			
			var where_list=[];
			for(var i in $scope.cache.where_list){
				where_list.push($scope.cache.where_list[i])
			}
			if($scope.cache.mode==1){
				for(var i in $scope.idList){
					where_list.push({field:'id',type:0,value:$scope.idList[i]})
				}
				if(!$scope.idList.length){
					$scope.message="完成查詢，沒有資料";
					$scope.$apply();
					return;
				}
			}
			if($scope.cache.mode==2){
				for(var i in $scope.idList){
					where_list.push({field:'id',type:1,value:$scope.idList[i]})
				}
			}
			if($scope.cache.mode==3){
				for(var i in $scope.idList){
					where_list.push({field:'id',type:0,value:$scope.idList[i]})
				}
				if(!$scope.idList.length){
					$scope.message="完成查詢，沒有資料";
					$scope.$apply();
					return;
				}
			}
			
			var post_data={
				func_name:"FansList::getList",
				arg:{
					where_list:where_list,
					limit:$scope.cache.limit,
					order_list:$scope.cache.order_list,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.list=res.list
					tagSystem.idSearchTag($scope.list.map(function(val){
						return val.id;
					}));					
				}else{
					$scope.list=[];
				}

				$scope.message="完成查詢"
				$scope.cache.limit.total_count=res.total_count;
				
				
				$scope.$apply(function(){
					setTimeout(function(){
						FB.XFBML.parse();
					},1000)
				});
				
			},"json")
			
		},500)
	}
	$scope.ch=function(update,where,callback){
		$scope.message="修改中...";
		var post_data={
			func_name:"FansList::update",
			arg:{
				update:update,
				where:where,
			},
		}
		var ch_item=$scope.list.find(function(val){
			var flag=true;
			for(var i in where){
				flag=flag && val[i]==where[i];
			}
			return flag;
		})
		
		callback && callback(ch_item,update,where);
		
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				for(var i in update){
					ch_item[i]=update[i];
				}
				$scope.message="修改成功!!!"
			}else{
				$scope.message="修改失敗!!!"
			}
			$scope.$apply();
		},"json")
	}
	$scope.text_ch=function(update,where){
		var timer_name="text_change_timer";
		for(var i in where){
			timer_name+=i+":"+where[i]+","
		}
		clearTimeout($scope[timer_name]);
		$scope[timer_name]=setTimeout(function(){
			$scope.ch(update,where)
		},500)
	}
		
	$scope.update_online=function(ids){
		var post_data={
			func_name:"FansList::getOnline",
			arg:{
				ids:ids,
			},
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				for(var i in res.list){					
					var update={
						fan_count:res.list[i].fan_count,
						name:res.list[i].name,
					}
					if(res.list[i].posts){
						update.last_post_time_int=new Date(res.list[i].posts.data[0].created_time).valueOf()/1000
					}

					var where={
						fb_id:res.list[i].id,
					}
					$scope.ch(update,where,function(item,update,where){
						if(item.status==2 || item.status==3){
							update.status=0;
						}
					});
				}
				
			}
			if(res.failIds && res.failIds.length){
				for(var i in res.failIds){
					var update={
						status:2,
					}
					var where={
						fb_id:res.failIds[i],
					}
					$scope.ch(update,where);
				}
			}
			
		},"json")
	}
	
	$scope.view_width=[
		{"col":2},
		{"col":1},
		{"col":2},
		{"col":2},
		{"col":2},
		{"col":2},
	]
	
	
}],
})