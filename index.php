<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<script 
id="facebook-jssdk" 
src="//connect.facebook.net/zh_TW/sdk.js"
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
	$rootScope.__proto__.Date=Date;
	$rootScope.$apply();
}])
</script>
<script src="app/factories/tagSystem.js?t=<?=time();?>"></script>

<script src="app/components/fansList/fansList.js?t=<?=time();?>"></script>

<script src="app/components/whereList/whereList.js?t=<?=time();?>"></script>
<script src="app/directives/pagnation/pagnation.js?t=<?=time();?>"></script>
<script src="app/directives/ngEnter/ngEnter.js?t=<?=time();?>"></script>
<script src="app/directives/ngRightClick/ngRightClick.js?t=<?=time();?>"></script>
<script src="app/directives/sortable/sortable.js?t=<?=time();?>"></script>


<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css?t=<?=time();?>">
<link rel="stylesheet" type="text/css" href="css/index.css?t=<?=time();?>">
<script>
FB.init({
	appId      :339868696395230,
	status     : true,
	xfbml      : true,
	version    : 'v2.8',
});
</script>
</head>
<body ng-app="app" class="container" style="overflow-y:scroll;">
	<tag-system 
	ng-show="cache.tag_system_show"
	class="col-xs-12" 
	style="height:{{tagSystem.size.h}}px"
	></tag-system>
	<input type="checkbox" ng-model="cache.tag_system_show"/>標籤系統
	<fans-list 
	ng-if="!cache.not_finish_flag" 
	></fans-list>
</body>
</html>