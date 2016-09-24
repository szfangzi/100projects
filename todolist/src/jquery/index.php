<!doctype html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <!--ie=edge 强制使用IE最新版本渲染(IE11已被弃用)-->
  <title>jquery-todolist</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
  <!-- build:css css/combined.css -->
  <link rel="stylesheet" href="../public/css/resets.css">
  <link rel="stylesheet" href="../public/css/main.css">
  <!-- endbuild -->

  <!-- build:js js/combined.js -->
  <script type="text/javascript" src="../public/js/jquery.min.js"></script>
  <script type="text/javascript" src="../public/js/ejs.min.js"></script>
  <script type="text/javascript" src="../public/js/director.js"></script>
  <script type="text/javascript" src="js/main.js"></script>
  <!-- endbuild -->
</head>
<body>
<div class="route">
  <a href="#/all" id="routeAll">所有任务</a>
  <a href="#/today" id="routeToday">今天任务</a>
</div>
<div class="container" id="container">
  <div class="todolist">
    <div class="main">
      <div class="top clearfix">
        <h1>任务列表</h1>
        <div class="r"></div>
      </div>
      <div class="listBox">
        <div class="addTask">
          <i class="addIcon">+</i>
          <input type="text" placeholder="添加任务" id="addTaskInput">
        </div>
        <div id="tasklist">
          <section class="list" id="unfList">
          </section>
          <section class="list">
            <a href="javascript:;" class="finishedBtn"><span class="showText">显示已完成任务</span><span class="hideText">隐藏已完成任务</span></a>
          </section>
          <section class="list isFinishedBox" id="fList"></section>
        </div>
      </div>
    </div>
  </div>
  <div class="detailBox">
    <div id="taskInfoBox">

    </div>
  </div>
</div>


<?php
include('../public/ejs/taskinfo.ejs');
include('../public/ejs/tasklist.ejs');
?>

</body>
</html>
