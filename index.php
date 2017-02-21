<?php
session_start();
setcookie("go_to","",time()-3600);
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

<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
<meta charset="utf-8" />
<script 
id="facebook-jssdk" 
src="//connect.facebook.net/zh_TW/sdk.js"
></script>
<script src="js/jquery.min.js?t=<?=time();?>"></script>
<script src="js/angular.min.js?t=<?=time();?>"></script>
<script src="js/localForage-1.4.2.min.js?t=<?=time();?>"></script>
<script src="js/postMessageHelper/postMessageHelper.js?t=<?=time();?>"></script>
<script src="app/modules/cache/cache.js?t=<?=time();?>"></script>

<script src="app/modules/tagSystem/tagSystem.js?t=<?=time();?>"></script>

<script src="app/modules/tagSystem/components/searchTag/searchTag.js?t=<?=time();?>"></script>
<script src="app/modules/tagSystem/components/searchTagElement/searchTagElement.js?t=<?=time();?>"></script>
<script src="app/modules/tagSystem/components/sourceTag/sourceTag.js?t=<?=time();?>"></script>
<script src="app/modules/tagSystem/components/tagLevel/tagLevel.js?t=<?=time();?>"></script>
<script src="app/modules/tagSystem/components/tagType/tagType.js?t=<?=time();?>"></script>
<script src="app/modules/tagSystem/components/tagRelation/tagRelation.js?t=<?=time();?>"></script>
<script src="app/modules/tagSystem/components/insertTagElement/insertTagElement.js?t=<?=time();?>"></script>
<script src="app/modules/tagSystem/factories/tagSystem.js?t=<?=time();?>"></script>
<script src="app/modules/tagSystem/factories/tagType.js?t=<?=time();?>"></script>
<script src="app/modules/tagSystem/factories/tagLevel.js?t=<?=time();?>"></script>
<script src="app/modules/tagSystem/factories/tagRelation.js?t=<?=time();?>"></script>


<script src="app/app.js?t=<?=time();?>"></script>


<script src="app/components/fansList/fansList.js?t=<?=time();?>"></script>


<script src="app/directives/pagnation/pagnation.js?t=<?=time();?>"></script>
<script src="app/directives/ngEnter/ngEnter.js?t=<?=time();?>"></script>
<script src="app/directives/ngRightClick/ngRightClick.js?t=<?=time();?>"></script>
<script src="app/directives/sortable/sortable.js?t=<?=time();?>"></script>


<link rel="stylesheet" type="text/css" href="css/index.css?t=<?=time();?>">
<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css?t=<?=time();?>">

<script>
FB.init({
	appId      :339868696395230,
	status     : true,
	xfbml      : true,
	version    : 'v2.8',
});

</script>
</head>
<body ng-app="app" class="container-fluid" style="overflow-y:scroll;">
	<fans-list 
	url="'<?=$_SESSION['tag_url']?>'"
	ng-if="!cache.not_finish_flag" 
	></fans-list>
</body>
</html>