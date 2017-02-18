angular.module("app",["cache","tagSystem"])
.config(['$compileProvider',function($compileProvider){
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}])
.run(["$rootScope",function($rootScope){
	$rootScope.__proto__.Date=Date;
}])