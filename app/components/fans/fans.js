angular.module('app').component("fans",{
bindings:{
	fbId:"=",
},
templateUrl:'app/components/fans/fans.html?t='+Date.now(),
controller:["$scope","$element",function($scope,$element){
	$scope.$watch("$ctrl.fbId",function(fb_id){
		var iframe=document.createElement("iframe");
		iframe.style="width:100%;height:70px;"
		iframe.setAttribute("marginwidth",0);
		iframe.setAttribute("marginheight",0);
		iframe.setAttribute("scrolling","no");
		iframe.setAttribute("frameborder",0);
		iframe.setAttribute("src",'fans.php?fb_id='+fb_id);
		$($element).html(iframe)
	},1)
}],
})