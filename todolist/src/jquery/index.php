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
  <script type="text/javascript" src="js/util.js"></script>
  <script type="text/javascript" src="js/app.js"></script>
  <script type="text/javascript" src="js/app.model.js"></script>
  <script type="text/javascript" src="js/app.controller.js"></script>
  <script>
    $(function () {
      App.init({});
    })
  </script>
  <!-- endbuild -->
</head>
<body>
<div class="container" id="container">
  <nav>
    <div class="nav-box">
      <div class="nav-top">
        <a class="toggle-sidebar" tabindex="0"><svg class="list-toggle" width="20px" height="20px"> <g> <path d="M0.5,3.5l19,0" style="fill:none;stroke-width:1px;stroke:white;"></path> <path d="M0.5,9.53l19,0" style="fill:none;stroke-width:1px;stroke:white;"></path> <path d="M0.5,15.5l19,0" style="fill:none;stroke-width:1px;stroke:white;"></path> </g> </svg></a>
      </div>
      <div class="user">
        <a class="user-box">
          <span class="user-avatar">
            <img src="../public/img/avatar.png">
          </span>
          <span class="user-name">房子</span>
        </a>
      </div>
      <div class="menu">
        <ul class="menu-filter" id="menu-filter">
          <li class="menu-filter-all">
            <a href="#/all" class="item-list clearfix">
              <span class="icon">
                <?php
                  include('../public/img/all.svg');
                ?>
              </span>
              <span class="title">收件箱</span>
              <span class="r">
                <span class="count passed">2</span>
                <span class="count">4</span>
              </span>
            </a>
          </li>
          <li class="menu-filter-today">
            <a href="#/today" class="item-list clearfix">
              <span class="icon">
                <?php
                  include('../public/img/today.svg');
                ?>
                <span class="today-num">26</span>
              </span>
              <span class="title">今天</span>
              <span class="r">
                <span class="count passed">2</span>
                <span class="count">4</span>
              </span>
            </a>
          </li>
        </ul>
        <ul class="menu-your" id="menu-your">

        </ul>
      </div>
      <div class="createList">
        <a href="javascript:;">
          <?php include('../public/img/add.svg'); ?>
          <span>创建清单</span>
        </a>
      </div>
    </div>

  </nav>
  <div class="todolist" id="todolist">
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
  <div class="detailBox" id="detailBox">
    <form id="taskInfoBox">

    </form>
  </div>
</div>


<?php
include('../public/ejs/taskinfo.ejs');
include('../public/ejs/tasklist.ejs');
include('../public/ejs/menu-your-tmpl.ejs');
?>
<div id="audio-player">
  <audio id="audio-notification" class="hide">
    <source class="ogg" src="../public/media/notification.ogg" type="audio/ogg">
  </audio>
  <audio id="audio-complete" class="hide">
    <source class="ogg" src="../public/media/complete.ogg" type="audio/ogg">
  </audio>
</div>
</body>
</html>
