angular.module('app')
.factory('whereListFunc',['$rootScope',function($rootScope){
	var add_where_list=function(list,item,replace){
		var item=angular.copy(item);
		if(replace){
			var index=list.findIndex(function(val){
				return 	val.field==item.field && val.type==item.type
			})
			
			if(index==-1){
				list.push(item);
			}else{
				list[index].value=item.value;
			}
		}else{
			var index=list.findIndex(function(val){
				return 	val.field==item.field && val.type==item.type && val.value==item.value
			})
			
			if(index==-1){
				list.push(item);
			}
		}
		
	}
	
	var add_order_list=function(list,item,replace){
		var item=angular.copy(item);
		var index=list.findIndex(function(val){
			return 	val.field==item.field;
		})
		
		if(index==-1){
			list.push(item);
		}else{
			list[index].type=item.type
		}
	}	
	return {
		add_where_list:add_where_list,
		add_order_list:add_order_list,
	}
}])