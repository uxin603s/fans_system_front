<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<script src="js/jquery.min.js"></script>
<script src="js/angular.min.js"></script>
<script src="js/localForage-1.4.2.min.js"></script>
<script src="app/module/cache/cache.js?t=<?=time();?>"></script>

<script src="app/app.js?t=<?=time();?>"></script>

<script src="app/components/fansList/fansList.js?t=<?=time();?>"></script>
<script src="app/directives/pagnation/pagnation.js?t=<?=time();?>"></script>


<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css?t=<?=time();?>">
<link rel="stylesheet" type="text/css" href="css/index.css?t=<?=time();?>">
</head>
<body ng-app="app">
	<fans-list ng-if="!cache.not_finish_flag" ></fans-list>
</body>
</html>