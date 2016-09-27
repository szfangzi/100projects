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
      if(self.getNavlist().length <= 0){
        $.ajax({
          url: '../public/json/navlist.json',
          method: 'GET',
          async: false,
          success: function (rs) {
            self.setNavlist(rs);
          }
        });
      }

      return self;
    },
    setNavlist: function (navlist) {
      var self = this;
      Util.store(navlistName, navlist);
    },
    getNavlist: function () {
      var self = this;
      return Util.store(navlistName);
    },
    getNavlistRecursion: function () {
      var self = this;
      var navlist = self.getNavlist();

      return nodeRecursion(navlist, "0");

      function nodeRecursion(nodes, pid) {
        var result = [], tmp;
        for(var i in nodes){
          if(nodes[i].pid === pid){
            var obj = Util.deepCopy(nodes[i], {});
            tmp = arguments.callee.apply({}, [nodes, nodes[i].id]);
            if(tmp.length > 0){
              obj.childs = tmp;
            }
            result.push(obj);
          }
        }
        return result;
      }
    },
    delTask: function (id, callback) {
      var self = this;
      var tasklist = Util.store(tasklistName);
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
      var tasklist = Util.store(tasklistName);
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
    getTaskList: function (listId, isFinished) {
      var self = this;
      var tasklist = Util.store(tasklistName);
      var tmpList = [];
      for (var k in tasklist) {
        if (tasklist[k].isFinished === isFinished && (listId === "0" || tasklist[k].listId === listId)) {
          tmpList.push(tasklist[k]);
        }
      }
      tmpList.sort(function (a, b) {
        return a['fDate'] >= b['fDate'] ? -1 : 1;
      });
      return tmpList;
    },
    getTask: function (id) {
      var self = this;
      var tasklist = Util.store(tasklistName);
      for (var k in tasklist) {
        if (tasklist[k].id === id) {
          return tasklist[k];
        }
      }
      return false;
    }
  }
}());
