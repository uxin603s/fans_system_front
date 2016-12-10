<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<script 
id="facebook-jssdk" 
src="//connect.facebook.net/zh_TW/all.js#xfbml=1"
></script>
<script src="js/jquery.min.js"></script>
<script src="js/angular.min.js"></script>
<script src="js/localForage-1.4.2.min.js"></script>
<script src="js/postMessageHelper/postMessageHelper.js"></script>
<script src="app/module/cache/cache.js?t=<?=time();?>"></script>

<script src="app/app.js?t=<?=time();?>"></script>
<script>
angular.module('app')
.run(['$rootScope','tagSystem',function($rootScope,tagSystem){
	tagSystem.init("http://tag.cfd888.info/?wid=5");
	$("tag-system").append(tagSystem.iframe);
	$rootScope.__proto__.tagSystem=tagSystem.data;
	// var timer;
	// $rootScope.$watch("cache.not_finish_flag",function(not_finish_flag){
		// if(not_finish_flag)return;
		// console.log($rootScope.cache.height)
		// $rootScope.$watch("tagSystem.size.h",function(h){
			// clearTimeout(timer);
			// timer=setTimeout(function(){
				// console.log(h)
				// $rootScope.cache.height=h;
				// $rootScope.$apply();
			// },5000)
		// },1);	
	// });	
	$rootScope.__proto__.Date=Date;
	$rootScope.$apply();
}])
</script>
<script src="app/factories/tagSystem.js?t=<?=time();?>"></script>

<script src="app/components/fansList/fansList.js?t=<?=time();?>"></script>
<script src="app/components/fans/fans.js?t=<?=time();?>"></script>
<script src="app/directives/pagnation/pagnation.js?t=<?=time();?>"></script>
<script src="app/directives/ngEnter/ngEnter.js?t=<?=time();?>"></script>
<script src="app/directives/ngRightClick/ngRightClick.js?t=<?=time();?>"></script>


<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css?t=<?=time();?>">
<link rel="stylesheet" type="text/css" href="css/index.css?t=<?=time();?>">

</head>
<body ng-app="app" class="container" style="overflow-y:scroll;">
	<tag-system 
	class="col-xs-12" 
	style="height:{{tagSystem.size.h}}px"
	></tag-system>
	
	<fans-list 
	ng-if="!cache.not_finish_flag" 
	></fans-list>
</body>
</html>