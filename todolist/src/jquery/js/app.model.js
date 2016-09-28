App.model = (function () {

  var tasklistName = 'tasklist';
  var navlistName = 'navlist';

  return {
    init: function () {
      var self = this;
      if(Util.store(tasklistName).length <= 0){
        $.ajax({
          url: '../public/json/todolist.json',
          method: 'GET',
          async: false,
          success: function (rs) {
            self.setTaskList(rs);
          }
        });
      }
      if(self.getNavList().length <= 0){
        $.ajax({
          url: '../public/json/navlist.json',
          method: 'GET',
          async: false,
          success: function (rs) {
            self.setNavList(rs);
          }
        });
      }

      return self;
    },
    setNavList: function (navlist) {
      var self = this;
      Util.store(navlistName, navlist);
    },
    getNavList: function () {
      var self = this;
      return Util.store(navlistName);
    },
    getNavListRecursion: function(){
      var self = this;
      var navlist = self.getNavList();
      var allTasklist = self.getTaskList('all').unfTmpList || [];
      var todaylist = self.getTaskList("today").unfTmpList || [];
      var allCount = self.getTaskListCount(allTasklist) || 0;
      var todayCount = self.getTaskListCount(todaylist) || 0;

      for (var k in navlist) {
        if(navlist[k].id !== "0" && navlist[k].type === 'list'){
          var list = self.getTaskList('list', navlist[k].id).unfTmpList;
          var countObj = self.getTaskListCount(list) || {};
          navlist[k].countObj = countObj;
        }
      }

      return {
        'all':{count:allCount},
        'today':{count:todayCount},
        'list':{navlist:Util.nodeRecursion(navlist, "0")}
      };
    },
    delTask: function (id, callback) {
      var self = this;
      var tasklist = self.getAllTaskList();
      for (var i = 0; i < tasklist.length; i++) {
        if (tasklist[i].id === id) {
          tasklist.splice(i, 1);
          self.setTaskList(tasklist);
        }
      }
      callback();
    },
    updateTaskList: function (task, callback) {
      var self = this;
      var tasklist = self.getAllTaskList();
      var type = 'add';
      for (var k in tasklist) {
        if (task.id === tasklist[k].id) {
          type = 'update';
          for (var i in task) {
            tasklist[k][i] = task[i];
          }
          break;
        }
      }
      if (type === 'add') {
        task = $.fn.extend({
          "id": Util.uuid(),
          "taskname": "",
          "fDate": "",
          "remark": "",
          "isFinished": false
        }, task);
        tasklist.push(task);
      }
      self.setTaskList(tasklist);
      callback();
    },
    setTaskList: function (tasklist) {
      Util.store(tasklistName, tasklist);
    },
    getAllTaskList: function () {
      return Util.store(tasklistName);
    },
    getTaskList: function (filter, listId) {
      var self = this;
      var tasklist = self.getAllTaskList();
      var tmpList = [], fTmpList = [], unfTmpList = [];

      if (filter === "all") {
        for (var k in tasklist) {
          tmpList.push(tasklist[k]);
          if (tasklist[k].isFinished === true) {
            fTmpList.push(tasklist[k]);
          } else if (tasklist[k].isFinished === false) {
            unfTmpList.push(tasklist[k]);
          }
        }
      }else if (filter === "today"){
        for (var k in tasklist) {
          var fDate = new Date(tasklist[k].fDate);
          if (Util.isToday(fDate)) {
            tmpList.push(tasklist[k]);
            if (tasklist[k].isFinished === true) {
              fTmpList.push(tasklist[k]);
            } else if (tasklist[k].isFinished === false) {
              unfTmpList.push(tasklist[k]);
            }
          }
        }
      }else if (filter === "list"){
        for (var k in tasklist) {
          if (tasklist[k].listId === listId) {
            tmpList.push(tasklist[k]);
            if (tasklist[k].isFinished === true) {
              fTmpList.push(tasklist[k]);
            } else if (tasklist[k].isFinished === false) {
              unfTmpList.push(tasklist[k]);
            }
          }
        }
      }

      tmpList.sort(descSortRule);
      fTmpList.sort(descSortRule);
      unfTmpList.sort(descSortRule);

      function descSortRule(a, b) {
        return a['fDate'] >= b['fDate'] ? -1 : 1;
      }

      return {
        tmpList:tmpList,
        fTmpList:fTmpList,
        unfTmpList:unfTmpList
      };
    },
    getTask: function (id) {
      var self = this;
      var tasklist = self.getAllTaskList();
      for (var k in tasklist) {
        if (tasklist[k].id === id) {
          return tasklist[k];
        }
      }
      return false;
    },
    getTaskListCount: function (tasklist) {
      var count = tasklist.constructor === Array?tasklist.length:0;
      var passedCount = 0;
      var now = new Date();
      for (var k in tasklist) {
        if(tasklist[k].fDate < now.getTime()){
          passedCount++;
        }
      }
      return {
        count:count,
        passedCount:passedCount
      }
    }

  }
}());
