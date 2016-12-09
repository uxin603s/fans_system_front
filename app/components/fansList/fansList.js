angular.module('app').component("fansList",{
bindings:{
},
templateUrl:'app/components/fansList/fansList.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	
	$scope.$watch("tagSystem.tagList",function(value){
		$scope.tagList=value;
	},1)
	$scope.$watch("tagSystem.idList",function(value){
		if($scope.cache.mode){
			$scope.idList=value;
			$scope.get();
		}
	},1)
	$scope.$watch("cache.mode",function(value){
		// tagSystem.setMode(value?0:1);
		tagSystem.tagSearchId($scope.cache.tagSearchId);
		$scope.get();
	});
	
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
		$scope.cache.mode=true
		$scope.cache.tagSearchId.splice(index,1);
	}
	$scope.cache.insert_list || ($scope.cache.insert_list=[]);
	$scope.$watch("tagSystem.insert",function(value){
		if(value && !$scope.cache.mode){
			if($scope.cache.insert_list.indexOf(value)==-1){
				$scope.cache.insert_list.push(value)
			}
		}
	},1);
	$scope.addTag=tagSystem.addIdRelation;
	$scope.delTag=tagSystem.delIdRelation;
	// console.log(tagSystem)
	$scope.field_data={
		status:{
			name:"狀態",
			list:{
				"0":"下架",
				"1":"上架",
				"2":"申訴",
				"3":"停權",
			},
		},
		id:{
			name:"id",
		},
		fb_id:{
			name:"FB ID",
		},
		comment:{
			name:"註記",
		},
		name:{
			name:"名稱",
		}
	}
	
	$scope.cache.where_list || ($scope.cache.where_list=[]);
	$scope.cache.limit || ($scope.cache.limit={page:0,count:10,total_count:0});
		
	$scope.get=function(){
		$scope.list=[];
		$scope.message="查詢中...";
		clearTimeout($scope.get_timer);
		$scope.get_timer=setTimeout(function(){
			var where_list=[];
			for(var i in $scope.cache.where_list){
				where_list.push($scope.cache.where_list[i])
			}
			
			if($scope.cache.mode){
				for(var i in $scope.idList){
					where_list.push({field:'id',type:0,value:$scope.idList[i]})
				}
				if(!$scope.idList || !$scope.idList.length){
					$scope.message="完成查詢，沒有資料";
					$scope.$apply();
					return
				}
			}
			
			var post_data={
				func_name:"FansList::getList",
				arg:{
					where_list:where_list,
					limit:$scope.cache.limit,
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
				
				$scope.$apply();
			},"json")
			
		},500)
	}
	$scope.ch=function(update,where){
		$scope.message="修改中...";
		var post_data={
			func_name:"FansList::update",
			arg:{
				update:update,
				where:where,
			},
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				var ch_item=$scope.list.find(function(val){
					return val.id==where.id
				})
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
	$scope.text_change=function(item,field){
		var update={}
		update[field]=item[field];
		var timer_name="text_change_timer"+item.id;
		clearTimeout($scope[timer_name]);
		$scope[timer_name]=setTimeout(function(){
			$scope.ch(update,{id:item.id})
		},500)
	}
	$scope.add_where_list=function(field,type,search){
		var value,value_tmp;
		value_tmp=search[field];
		delete search[field];
		if(type==2){
			value="%"+value_tmp+"%"
		}else{
			value=value_tmp;
		}
		
		var add={
			field:field,
			type:type,
			value:value,
			value_tmp:value_tmp,
		}
		var index=$scope.cache.where_list.findIndex(function(val){
			return 	val.field==add.field && val.type==add.type && val.value==add.value
		})
		if(index==-1){
			$scope.cache.where_list.push(add);
		}
	}
	
	$scope.$watch("cache.where_list",function(){
		$scope.get();
	},1)
}],
})