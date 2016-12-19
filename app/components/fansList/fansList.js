angular.module('app').component("fansList",{
bindings:{},
templateUrl:'app/components/fansList/fansList.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	
	$scope.$watch("cache.mode",function(value){
		tagSystem.setMode(value);
		$scope.get();
	},1)
	$scope.$watch("tagSystem.tagList",function(value){
		$scope.tagList=value;
	},1)
	$scope.$watch("tagSystem.idList",function(value){
		$scope.idList=value;
		$scope.get();
	},1)
	
	
	$scope.cache.tagSearchId || ($scope.cache.tagSearchId=[]);
	$scope.$watch("cache.tagSearchId",function(value){
		tagSystem.tagSearchId(value);
	},1);
	$scope.addSearch=function(search){
 		if($scope.cache.tagSearchId.indexOf(search.tag)==-1){
			$scope.cache.tagSearchId.push(search.tag);
		}
		search.tag=''
	}
	$scope.delSearch=function(index){
		$scope.cache.tagSearchId.splice(index,1);
	}
	$scope.cache.insert_list || ($scope.cache.insert_list=[]);
	$scope.$watch("tagSystem.insertList",function(value){
		if(!value)return;
		$scope.cache.insert_list=value;
	},1);
	$scope.cache.customInsertList || ($scope.cache.customInsertList={});
	$scope.$watch("tagSystem.customInsertList",function(value){
		if(!value)return;
		for(var i in value){
			if(value[i] && value[i].length){
				$scope.cache.customInsertList[i]=value[i];
			}else{
				alert("沒有此標籤")
			}
		}
	},1);
	$scope.delCustomInsertList=function(name){
		delete $scope.cache.customInsertList[name];
	}

	$scope.addTag=tagSystem.addIdRelation;
	$scope.delTag=tagSystem.delIdRelation;
	$scope.searchTagName=tagSystem.searchTagName;
	
	/*-----------------------*/
	$scope.fieldStruct={
		field:[
			{
				enName:'status',
				name:"狀態",
				type:'1',
				list:{
					"0":"下架",
					"1":"上架",
					"2":"申訴",
					"3":"停權",
				},
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
		order:["fan_count","last_post_time_int"],
		default:{
			where:{field:'status',type:"0"},
			order:{field:'fan_count',type:"0"},
		}
	}
	
	/*-----------------------*/
	$scope.cache.where_list || ($scope.cache.where_list=[{field:'status',type:0,value:1}]);
	$scope.cache.limit || ($scope.cache.limit={page:0,count:10,total_count:0});
	$scope.cache.order_list || ($scope.cache.order_list=[{field:'fan_count',type:1}]);
	
	
	
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
		var timer_name="text_change_timer"+item.id;
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
		{"col":3},
		{"col":1},
		{"col":2},
		{"col":3},
		{"col":1},
	]
	
	
}],
})