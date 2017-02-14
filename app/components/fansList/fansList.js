angular.module('app').component("fansList",{
bindings:{},
templateUrl:'app/components/fansList/fansList.html?t='+Date.now(),
controller:["$scope","whereListFunc","tagSystem",function($scope,whereListFunc,tagSystem){
	
	$scope.tagName={};
	var getWebTagType=function(){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:"WebTagType::getList",
				arg:{
					where_list:[
						{field:'wid',type:0,value:1},
					],
				}
			}
			tagSystem.post(post_data,function(res){
				
				// console.log(res)
				if(res.status){
					var tids=res.list.map(function(val){
						return val.tid;
					})
					resolve(tids);
				}else{
					
				}
			});
		})
		
	}
	var getTagLevel=function(tids){
		return new Promise(function(resolve,reject){
			var where_list=[]
			for(var i in tids){
				where_list.push({field:'tid',type:0,value:tids[i]})
			}
			
			var post_data={
				func_name:"TagLevel::getList",
				arg:{
					where_list:where_list,
				}
			}
			tagSystem.post(post_data,function(res){
				console.log(res)
				// if(res.status){
					// $scope.tagTreeName=res.tagName;
					// $scope.tagTree=res.data;
				// }
			});
		})
	}
	
	
	getWebTagType()
	.then(function(tids){
		// console.log(tids)
		return getTagLevel(tids);
	})
	
	var getTagRelation=function(callback){
		var post_data={
			func_name:"TagRelation::getList",
			arg:{
				wid:1,
			}
		}
		tagSystem.post(post_data,function(res){
			console.log(res)
		});
	}
	
	var getTagName=function(tids){
		var where_list=[];
		for(var i in tids){
			where_list.push({field:'id',type:0,value:tids[i]})
		}
		var post_data={
			func_name:"TagName::getList",
			arg:{
				where_list:where_list
			}
		}
		tagSystem.post(post_data,function(res){
			if(res.status){
				for(var i in res.list){
					var id=res.list[i].id;
					var name=res.list[i].name;
					$scope.tagName[id]=name;
				}
			}
		})
	}
	var getWebRelation=function(ids){
		var where_list=[];
		where_list.push({field:'wid',type:0,value:1})
		for(var i in ids){
			where_list.push({field:'source_id',type:0,value:ids[i]})
		}
		var post_data={
			func_name:"WebRelation::getList",
			arg:{
				where_list:where_list,
			}
		}
		tagSystem.post(post_data,function(res){
			var tids=[];
			$scope.tagRelation={};
			if(res.status){
				for(var i in res.list){
					var source_id=res.list[i].source_id
					var tid=res.list[i].tid
					tids.push(tid);
					if(!$scope.tagRelation[source_id]){
						$scope.tagRelation[source_id]={};
					}
					$scope.tagRelation[source_id][tid]=tid;
				}
				getTagName(tids)
			}
		});
	}
	// get_tag_relation();
	$scope.$watch("insert.search",function(search){
		if(!search)return;
		search.toString().replace("https://www.facebook.com/","").replace("/","").match(/(\w+)/)
		var search=RegExp.$1;
		delete $scope.insert.fb_id
		delete $scope.insert.name
		
		clearTimeout($scope.preview_fb_id_timer);
		$scope.preview_fb_id_timer=setTimeout(function(){
			FB.api("/"+search+"?fields=id,name,fan_count&access_token="+$scope.AppData.id+"|"+$scope.AppData.secret,function(res){//
				$scope.insert.fb_id=res.id;
				$scope.insert.name=res.name;
				$scope.insert.fan_count=res.fan_count;
				
				$scope.$apply(function(){
					setTimeout(function(){
						FB.XFBML.parse();
					},1000)
				});
			})
		},500)
	},1)
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
					$scope.list=res.list;
				}else{
					$scope.list=[];
				}
				
				getWebRelation(res.list.map(function(val){return val.id}));
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
		{"col":2},
		{"col":2},
		{"col":6},
	]
	
}],
})