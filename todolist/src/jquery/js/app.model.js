App.model = (function () {

  var tasklistName = 'tasklist';
  var navlistName = 'navlist';

  return {
    init: function () {
      var self = this;
      if(self.getTasklist().length <= 0){
        $.ajax({
          url: '../public/json/todolist.json',
          method: 'GET',
          async: false,
          success: function (rs) {
            self.setTasklist(rs);
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
      var tasklist = self.getTasklist();
      for (var i = 0; i < tasklist.length; i++) {
        if (tasklist[i].id === id) {
          tasklist.splice(i, 1);
          self.setTasklist(tasklist);
        }
      }
      callback();
    },
    updateTasklist: function (task, callback) {
      var self = this;
      var tasklist = self.getTasklist();
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
          "fDate": new Date().getTime(),
          "remark": "",
          "isFinished": false
        }, task);
        tasklist.push(task);
      }
      self.setTasklist(tasklist);
      callback();
    },
    setTasklist: function (tasklist) {
      var self = this;
      Util.store(tasklistName, tasklist);
    },
    getTasklist: function () {
      var self = this;
      return Util.store(tasklistName);
    },
    getFlist: function () {
      var self = this;
      var tasklist = self.getTasklist();
      var fList = [];
      for (var k in tasklist) {
        if (tasklist[k].isFinished) {
          fList.push(tasklist[k]);
        }
      }
      fList.sort(function (a, b) {
        return a['fDate'] >= b['fDate'] ? -1 : 1;
      });
      return fList;
    },
    getUnflist: function () {
      var self = this;
      var tasklist = self.getTasklist();
      var unfList = [];
      for (var k in tasklist) {
        if (!tasklist[k].isFinished) {
          unfList.push(tasklist[k]);
        }
      }
      unfList.sort(function (a, b) {
        return a['fDate'] >= b['fDate'] ? -1 : 1;
      });
      return unfList;
    },
    getTaskById: function (id) {
      var self = this;
      var tasklist = self.getTasklist();
      for (var k in tasklist) {
        if (tasklist[k].id === id) {
          return tasklist[k];
        }
      }
      return false;
    }
  }
}());
