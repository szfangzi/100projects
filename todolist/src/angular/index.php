<!doctype html>
<html lang="zh" ng-app="todolistApp">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <!--ie=edge 强制使用IE最新版本渲染(IE11已被弃用)-->
  <title>angular-todolist</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
  <!-- build:css css/combined.css -->
  <link rel="stylesheet" href="../public/css/resets.css">
  <link rel="stylesheet" href="../public/css/main.css">
  <!-- endbuild -->
  <script type="text/javascript" src="js/lib/angular.min.js"></script>
  <script type="text/javascript" src="js/lib/angular-route.min.js"></script>
  <script type="text/javascript" src="js/lib/angular-resource.min.js"></script>
  <!--<script type="text/javascript" src="js/lib/angular-animate.min.js"></script>-->
  <script type="text/javascript" src="js/app.js"></script>
</head>
<body>
<div class="route">
  <a href="#/" id="routeIndex">首页</a>
  <a href="#/forecast" id="routeTest">天气</a>
</div>
<div class="container enter" ng-view="">

</div>


<?php
include('../public/ejs/taskinfo.ejs');
include('../public/ejs/tasklist.ejs');
?>
<!-- build:js js/combined.js -->
<!--<script type="text/javascript" src="../public/js/jquery.min.js"></script>-->
<!--<script type="text/javascript" src="../public/js/ejs.min.js"></script>-->
<script type="text/javascript" src="../public/js/lib.js"></script>
<!-- endbuild -->
</body>
</html>
