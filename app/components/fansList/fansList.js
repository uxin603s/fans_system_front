angular.module('app').component("fansList",{
bindings:{
},
templateUrl:'app/components/fansList/fansList.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	console.log(tagSystem)
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