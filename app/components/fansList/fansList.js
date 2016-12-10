angular.module('app').component("fansList",{
bindings:{
},
templateUrl:'app/components/fansList/fansList.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	
	$scope.$watch("cache.mode",function(value){
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
	// console.log(tagSystem)
	$scope.field_data=[
		{
			enName:'status',
			name:"狀態",
			list:{
				"0":"下架",
				"1":"上架",
				"2":"申訴",
				"3":"停權",
			},
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
	];
	$scope.fieldName={};
	$scope.fieldNameR={};
	for(var i in $scope.field_data){
		$scope.fieldName[i]=$scope.field_data[i].enName;
		$scope.fieldNameR[$scope.field_data[i].enName]=i;
	}
	$scope.view_width=[
		{"col":2},
		{"col":3},
		{"col":1},
		{"col":2},
		{"col":3},
		{"col":1},
	]
	$scope.cache.where_list_item={field:'status',type:"0"};
	$scope.where_list_type_arr=[
		"等於","不等於","包含","不包含",
	]
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
				$scope.flushFB();
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
	$scope.add_where_list=function(item){
		var index=$scope.cache.where_list.findIndex(function(val){
			return 	val.field==item.field && val.type==item.type && val.value==item.value
		})
		if(index==-1){
			$scope.cache.where_list.push(item);
		}
	}
	
	$scope.$watch("cache.where_list",function(){
		$scope.get();
	},1)
	
	
	
	
	
	
}],
})