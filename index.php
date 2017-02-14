<?php
setcookie("go_to","",time()-3600);
session_start();
if(isset($_SESSION['rid'])){

}else{
	setcookie("go_to",$_SERVER['REQUEST_URI']);
	header("location:login.php");
	exit;
}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<script 
id="facebook-jssdk" 
src="//connect.facebook.net/zh_TW/sdk.js"
></script>
<script src="js/jquery.min.js?t=<?=time();?>"></script>
<script src="js/angular.min.js?t=<?=time();?>"></script>
<script src="js/localForage-1.4.2.min.js?t=<?=time();?>"></script>
<script src="js/postMessageHelper/postMessageHelper.js?t=<?=time();?>"></script>
<script src="app/module/cache/cache.js?t=<?=time();?>"></script>
<script src="app/module/whereList/whereList.js?t=<?=time();?>"></script>
<script src="app/module/tagSystem/tagSystem.js?t=<?=time();?>"></script>


<script src="app/app.js?t=<?=time();?>"></script>


<script src="app/components/fansList/fansList.js?t=<?=time();?>"></script>


<script src="app/directives/pagnation/pagnation.js?t=<?=time();?>"></script>
<script src="app/directives/ngEnter/ngEnter.js?t=<?=time();?>"></script>
<script src="app/directives/ngRightClick/ngRightClick.js?t=<?=time();?>"></script>
<script src="app/directives/sortable/sortable.js?t=<?=time();?>"></script>


<link rel="stylesheet" type="text/css" href="css/index.css?t=<?=time();?>">
<script>
FB.init({
	appId      :339868696395230,
	status     : true,
	xfbml      : true,
	version    : 'v2.8',
});
if(window.location.hash){
	window.location.href="http://"+window.location.hostname+window.location.pathname;
}
</script>
</head>
<body ng-app="app" class="container" style="overflow-y:scroll;">
	<fans-list 
	ng-if="!cache.not_finish_flag" 
	></fans-list>
</body>
</html>