var todolistApp = angular.module('todolistApp', ['ngRoute', 'ngResource']);

todolistApp.config(function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl:'page/todolistPage.html',
    controller:'TodolistPageController'
  }).when('/forecast', {
    templateUrl:'page/forecastPage.html',
    controller:'ForecastPageController'
  });

});

todolistApp.controller('TodolistPageController', ['$scope', '$resource', '$tasklistService', function ($scope, $resource, $tasklistService) {
  var tasklist = $tasklistService.tasklist;
  $scope.toFinished = function (e) {
    var taskId = this.item.id || -1;
    //document.querySelector('.detailBox .isFinished').setAttribute('checked', !this.$item.isFinished);
    for (var k in tasklist) {
      if(tasklist[k].id == taskId){
        tasklist[k].isFinished = !this.item.isFinished;
        $tasklistService.update(tasklist[k]);
        //$tasklistService.tasklist = tasklist;
      }
    }
  };

  //
  //$scope.$watch('fList + unfList', function() {
  //  $scope.fList = fList;
  //  $scope.unfList = unfList;
  //});

}]).controller('AddTaskController', ['$scope', '$resource', '$tasklistService', function ($scope, $resource, $tasklistService) {

  $scope.addTask = function (e) {
    if(e.keyCode == 13){
      $tasklistService.insert({
        taskname:$scope.newTaskName,
        fDate:'',
        remark:'',
        isFinished:false
      });

      $scope.newTaskName = '';

    }

  }

}]).controller('ForecastPageController', ['$scope', function ($scope) {

}]);

todolistApp.service('$tasklistService', [function () {
  var self = this;
  if(!self.tasklist){
    _init();
  }

  function _init() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../public/json/todolist.json", false);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          self.tasklist = JSON.parse(xhr.responseText) || [];
          spiltList();

        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);

  }

  self.insert = function (newTask) {
    newTask.id = self.initId;
    self.tasklist.push(newTask);
    spiltList();
    self.initId++;
  };
  self.update = function (task) {
    var tasklist = self.tasklist;
    for (var k in tasklist) {
      if(tasklist[k].id == task.id){
        tasklist[k] = task;
      }
    }
  };
  self.del = function () {

  };

  function spiltList() {
    var tasklist = self.tasklist;
    var fList = [], unfList = [];
    for (var i=0;i<tasklist.length;i++) {
      tasklist[i].fDateFormat = tasklist[i].fDate?new Date(tasklist[i].fDate).Format('YYYY-MM-DD'):'';
      if(tasklist[i].isFinished === true){
        fList.push(tasklist[i]);
      }else{
        unfList.push(tasklist[i]);
      }
    };
    //按时间倒序
    unfList.sort(
      function(a, b){
        if(a.fDate < b.fDate) return 1;
        if(a.fDate > b.fDate) return -1;
        return 0;
      }
    );
    fList.sort(
      function(a, b){
        if(a.fDate < b.fDate) return 1;
        if(a.fDate > b.fDate) return -1;
        return 0;
      }
    );
    self.unfList = unfList;
    self.fList = fList;
  }

}]);

todolistApp.directive("tasklist", ['$tasklistService', function ($tasklistService) {
  var fList = $tasklistService.fList;
  var unfList = $tasklistService.unfList;

  return {
    restrict: 'E',
    templateUrl: 'directive/tasklist.html',
    replace: true,
    link: function($scope) {
      $scope.$watch(() => $tasklistService.unfList, (unfList) => {
        $scope.unfList = unfList;
      });
      $scope.$watch(() => $tasklistService.fList, (fList) => {
        $scope.fList = fList;
      });

    }
  }
}]);
