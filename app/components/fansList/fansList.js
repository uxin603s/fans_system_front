angular.module('app').component("fansList",{
bindings:{
	url:"=",
},
templateUrl:'app/components/fansList/fansList.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	$scope.insert={};
	$scope.get_fan_data=function(fb_id,item){
		// console.log(fb_id,item)
		FB.api("/"+fb_id+"?fields=id,name,fan_count&access_token="+$scope.AppData.id+"|"+$scope.AppData.secret,function(res){//
			if(res.error){
				console.log(res.error);
				// for(var i in item){
					// delete item[i];
				// }
				// error && error();
			}else{
				item.fb_id=res.id;
				item.name=res.name;
				item.fan_count=res.fan_count;
			}
			$scope.$apply();
		})
	}
	$scope.add=function(arg){
		if(arg.fb_id){
			fb_id
			return
		}
		var post_data={
			func_name:"FansList::insert",
			arg:arg,
		}
		$.post("ajax.php",post_data,function(res){
			// console.log(res)
			if(res.status){
				res.insert.status=0
				$scope.list.unshift(res.insert);
				$scope.$apply();
			}
		},"json")
	}
	
	$scope.getFB=function(){
		var post_data={
			func_name:"FansList::getFB",
		}
		$.post("ajax.php",post_data,function(res){
			$scope.AppData=res;
			$scope.$apply();
		},"json")
	}
	$scope.getFB();
	$scope.setFB=function(arg){
		var post_data={
			func_name:"FansList::setFB",
			arg:arg,
		}
		$.post("ajax.php",post_data,function(res){
			$scope.AppData=arg;
			$scope.$apply();
		},"json")
	}
	$scope.status_arr=[
		{id:0,name:"下架",},
		{id:1,name:"上架",},
		{id:2,name:"申訴",},
		{id:3,name:"停權",},
	]
	
	/*-----------------------*/
	$scope.cache.search_tid || ($scope.cache.search_tid={})
	$scope.cache.search_tid.result || ($scope.cache.search_tid.result=[])
	$scope.cache.search_tid.required || ($scope.cache.search_tid.required=[])
	$scope.cache.search_tid.optional || ($scope.cache.search_tid.optional=[])
	$scope.cache.search_tid.tmp || ($scope.cache.search_tid.tmp=[])
	
	$scope.cache.limit || ($scope.cache.limit={page:0,count:10,total_count:0});
	$scope.cache.where_name || ($scope.cache.where_name=[])
	$scope.cache.where_status || ($scope.cache.where_status={field:'status',type:0,value:1,sw:0})
	
	$scope.cache.order_list || ($scope.cache.order_list={field:'fan_count',type:1})
	$scope.$watch("cache.where_status",function(status){
		$scope.get();
	},1)
	$scope.$watch("cache.order_list",function(status){
		$scope.get();
	},1)
	
	$scope.add_where_name=function(name){
		if($scope.cache.where_name.indexOf(name)==-1){
			$scope.cache.where_name.push(name)
			$scope.get();
		}
	}
	$scope.del_where_name=function(index){
		$scope.cache.where_name.splice(index,1);
		$scope.get();
	}
	$scope.get=function(){
		$scope.list=[];
		$scope.message="查詢中...";
		clearTimeout($scope.get_timer);
		$scope.get_timer=setTimeout(function(){
			var order_list=[];
			if($scope.cache.order_list){
				order_list.push($scope.cache.order_list)
			}
			var where_list=[];
			if($scope.cache.where_status.sw){
				where_list.push($scope.cache.where_status)
			}
			for(var i in $scope.cache.where_name){
				var name=$scope.cache.where_name[i];
				where_list.push({field:'name',type:2,value:"%"+name+"%"});
			}
			// console.log($scope.cache.search_tid)
			if($scope.cache.search_tid.required.length+$scope.cache.search_tid.optional.length){
				
				if($scope.cache.search_tid.result.length){
					for(var i in $scope.cache.search_tid.result){
						var id=$scope.cache.search_tid.result[i]
						where_list.push({
							field:"id",
							type:"0",
							value:id,
						})
					}
				}else{
					$scope.cache.limit.total_count=0;
					$scope.list=[];
					$scope.message="完成查詢"
					$scope.$apply();
					return
				}
				
			}
			var post_data={
				func_name:"FansList::getList",
				arg:{
					where_list:where_list,
					limit:$scope.cache.limit,
					order_list:order_list,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.list=res.list;
				}else{
					$scope.list=[];
				}
				for(var i in res.list){
					$scope.get_fan_data(res.list[i].fb_id,res.list[i]);
				}
				$scope.message="完成查詢"
				$scope.cache.limit.total_count=res.total_count;
				
				
				$scope.$apply();
				// function(){
					// setTimeout(function(){
						// FB.XFBML.parse();
					// },1000)
				// }
			},"json")
			
		},500)
	}
	
	$scope.$watch("cache.search_tid.result",$scope.get,1);
	$scope.$watch("cache.search_tid.required",$scope.get,1);
	$scope.$watch("cache.search_tid.optional",$scope.get,1);
	// $scope.$watch("cache.search_tid.result",function(dd){
		// console.log(dd)
	// },1);
	
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
	
	
}],
})