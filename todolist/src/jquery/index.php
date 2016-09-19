<!doctype html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <!--ie=edge 强制使用IE最新版本渲染(IE11已被弃用)-->
  <title>Responsive</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
  <!-- build:css css/combined.css -->
  <link rel="stylesheet" href="../public/css/resets.css">
  <link rel="stylesheet" href="../public/css/main.css">
  <!-- endbuild -->
</head>
<body>
<div class="route">
  <button id="routeIndex">首页</button>
  <button id="routeTest">test</button>
</div>
<div class="container" id="todolistPage">
  <div class="todolist">
    <div class="main">
      <div class="top clearfix">
        <h1>任务列表</h1>
        <div class="r"></div>
      </div>
      <div class="listBox">
        <div class="addTask">
          <i class="addIcon">+</i>
          <input type="text" placeholder="添加任务">
        </div>
        <div id="tasklist"></div>
      </div>
    </div>
  </div>
  <div class="detailBox">
    <div id="taskInfoBox">

    </div>
  </div>
</div>

<div class="container" id="testPage" style="background-color: beige;width: 100%;height: 100vh;">
  第二页
</div>

<?php
include('../public/ejs/taskinfo.ejs');
include('../public/ejs/tasklist.ejs');
?>
<!-- build:js js/combined.js -->
<script type="text/javascript" src="../public/js/jquery.min.js"></script>
<script type="text/javascript" src="../public/js/ejs.min.js"></script>
<script type="text/javascript" src="../public/js/lib.js"></script>
<script type="text/javascript" src="js/main.js"></script>
<!-- endbuild -->
</body>
</html>
