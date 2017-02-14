angular.module('tagSystem',[])
.factory('tagSystem',['$rootScope',function($rootScope){
	var data={
		size:{
			w:0,
			h:0,
		},
		idList:[],
		tagList:{},
	}
	var iframe=document.createElement("iframe");
	iframe.style="width:100%;height:100%;"
	iframe.setAttribute("marginwidth",0);
	iframe.setAttribute("marginheight",0);
	iframe.setAttribute("scrolling","no");
	iframe.setAttribute("frameborder",0);
	// document.body.appendChild(iframe)
	var source;
	var timer={};
	var post_id="post"+(Date.now()+Math.floor(Math.random()*999));
	$rootScope[post_id]={}
	var init=function(src){
		var load=function(){
			source=iframe.contentWindow;
			postMessageHelper.init("tagSystem",source)
			postMessageHelper.send("tagSystem")
			postMessageHelper.receive("tagSystem",function(res){
				// clearTimeout(timer[res.name])
				// timer[res.name]=setTimeout(function(){
					if(res.name=="post"){
						$rootScope[post_id][res.value.id]=res.value.value;
					}
					$rootScope.$apply();
				// },0)
			})
		}
		iframe.onload=load
		iframe.src=src;
	}
	var post=function(request,callback){
		var id="rand"+Date.now()+Math.floor(Math.random()*9999);
		postMessageHelper
			.send("tagSystem",{name:'post',value:{request:request,id:id}})
		var watch=$rootScope.$watch(post_id+"."+id,function(res){
			if(res){
				callback && callback(res);
				watch();
			}
		},1);
		
	}
	
	
	return {
		init:init,
		iframe:iframe,
		post:post,
	}
}])
.component("tagSystem",{
bindings:{
	accessToken:"=",
},
templateUrl:'app/module/tagSystem/tagSystem.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	$scope.$ctrl.$onInit=function(){
		// console.log(1)
		// var url="http://tag.cfd888.info/api.php";
		var url="http://192.168.1.2/tag_system_front/api.php";
		if($scope.$ctrl.accessToken){
			var access_token=$scope.$ctrl.accessToken;
			url+="?access_token="+access_token;
		}
		tagSystem.init(url);
		$("tag-system>div").append(tagSystem.iframe);
		$scope.tagSystem=tagSystem.data;
	}
}],
})
