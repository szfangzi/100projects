$(function(){

  window.Util = Util = {
    uuid: function () {
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
      }

      return uuid;
    },
    store: function (name, data) {
      var data = data || [];
      if(arguments.length > 1){
        localStorage[name] = JSON.stringify(data);
      }else{
        var store = localStorage[name];
        return (store && JSON.parse(store)) || [];
      }

    },
    dateFormat: function (obj, fmt) {
      var o = {
        "M+": obj.getMonth() + 1, //月份
        "D+": obj.getDate(), //日
        "h+": obj.getHours(), //小时
        "m+": obj.getMinutes(), //分
        "s+": obj.getSeconds(), //秒
        "q+": Math.floor((obj.getMonth() + 3) / 3), //季度
        "S": obj.getMilliseconds() //毫秒
      };
      if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (obj.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    },
    isToday:function(date){
      var now = new Date();
      if(date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()){
        return true;
      }
      return false;
    },
    isPassedDate:function(timestamp){
      var now = new Date();
      if(now.getTime() > timestamp){
        return true;
      }
      return false;
    }
  };

  var App = {
    testData: function () {
      var self = this;
      $.ajax({
        url:'../public/json/todolist.json',
        method:'GET',
        async:false,
        success: function (rs) {
          self.setTasklist(rs);
        }
      });
    },
    init: function (options) {
      var self = this;
      self.defaults = {
        keyCode:{
          enter:13,
          esc:27
        },
        tasklistName:'tasklist',
        baseUrl:'/100projects/todolist/src/jquery'
      };
      self.options = {};
      $.fn.extend(self.options, self.defaults, options);

      self.$container = $('#container');
      self.$addTaskInput = $('#addTaskInput');
      self.$todolist = $('#todolist');
      self.$detailBox = $('#detailBox');
      self.$tasklist = $('#tasklist');
      self.$fList = $('#fList');
      self.$fListTmpl = $('#fListTmpl');
      self.$unfList = $('#unfList');
      self.$unfListTmpl = $('#unfListTmpl');
      self.$taskInfoBox = $('#taskInfoBox');
      self.$taskInfoTmpl = $('#taskInfoTmpl');
      self.audioNotification = document.querySelector('#audio-notification');
      self.audioComplete = document.querySelector('#audio-complete');

      var tasklist = self.getTasklist();
      if(tasklist.length <= 0){
        self.testData();
      }
      self.bindEvent();
      self.initRoute();

      return self;
    },
    initRoute: function () {
      var self = this;
      var route = new Router({
        '/': {
          once:function(){
            self.route = this;
          },
          '/all': {
            on: function () {
              self.renderTasklist();
            },
            '/task/:taskId': routeTask
          },
          '/today': {
            on: function () {
              self.renderTasklist();
            },
            '/task/:taskId': routeTask
          }
        }

      }).configure({
            recurse:'forward',
            notfound:function(){
              window.location.hash = '/all';
            }
          }).init('/all');

      function routeTask(taskId){
        var task = self.getTaskById(taskId);
        self.renderTaskInfo(task);
        self.showTaskInfo();
        if(task.isFinished){
          $('.finishedBtn').addClass('on');
          self.$fList.addClass('on');
        }
        $('#tasklist .item[taskId="'+taskId+'"]').click();
      }
    },
    bindEvent: function () {
      var self = this;

      $(window).on('keydown', function (e) {
        e.stopPropagation();
        if(e.keyCode === self.options.keyCode.esc){
          self.hideTaskInfo();
        }
      });

      self.$container.on('keydown', '#addTaskInput', function (e) {
        var $this = $(this);
        if(e.keyCode == self.options.keyCode.enter){
          var taskname = $.trim($this.val());
          self.updateTasklist({taskname:taskname}, function () {
            self.renderTasklist();
            $this.val('');
          });

        }

      }).on('click', '.finishedBtn', function (e) {
        e.stopPropagation();
        var $this = $(this);
        $this.toggleClass('on');
        self.$fList.toggleClass('on');
      }).on('click', '#tasklist .isFinished, #taskInfoBox .isFinished', function (e) {
        e.stopPropagation();
        var $this = $(this);
        var taskId = '0';
        if($this.parents('.item').length){
          taskId = $this.parents('.item').attr('taskId');
        }else{
          taskId = $this.parents('.taskName').attr('taskId');
        }
        self.updateTasklist({id:taskId, isFinished:$this.prop('checked')}, function () {
          self.renderTasklist();
          if($this.parents('.item').length){
            var task = self.getTaskById(taskId);
            self.renderTaskInfo(task);
          }
          if($this.prop('checked')){
            self.audioComplete.load();
            self.audioComplete.play();
          }
        });

      }).on('dblclick', '#tasklist .item', function (e) {
        e.stopPropagation();
        var $this = $(this);
        var taskId = $this.attr('taskId')||"0";
        self.route.setRoute(self.route.getRoute(0)+'/task/'+taskId);

      }).on('click', '#tasklist .item', function (e) {
        e.stopPropagation();
        var $this = $(this);
        self.$tasklist.find('.item').removeClass('on');
        $this.addClass('on');

      }).on('click', '#taskInfoBox .backBtn, #todolist .main', function (e) {
        e.stopPropagation();
        if($.inArray('task', self.route.getRoute()) !== -1){
          self.hideTaskInfo();
          self.route.setRoute(self.route.getRoute(0));
        }

      }).on('click', '#taskInfoBox .delBtn', function (e) {
        var $this = $(this);
        var taskId = self.$taskInfoBox.find('.taskName').attr('taskId');
        self.delTask(taskId, function () {
          self.hideTaskInfo();
          self.renderTasklist();
        });
      }).on('blur', '#taskInfoBox input[name="fDate"]', function(e){
        var $this = $(this);
        var taskId = self.$taskInfoBox.find('input[name="id"]').val();
        var fDate = $this.val();
        var fDateTimestamp = new Date(fDate).getTime();
        self.updateTasklist({id:taskId, fDate:fDateTimestamp}, function () {
          if(Util.isPassedDate(fDateTimestamp)){
            $this.parents('li').addClass('passed');
          }else{
            $this.parents('li').removeClass('passed');
          }
          self.renderTasklist();
        });

      }).on('blur', '#taskInfoBox input[name="remark"]', function(e){
        var $this = $(this);
        var taskId = self.$taskInfoBox.find('input[name="id"]').val();
        var remark = $this.val();
        self.updateTasklist({id:taskId, remark:remark}, function () {
          self.renderTasklist();
        });

      }).on('keydown', '#taskInfoBox input[name="remark"]', function(e){
        if(e.keyCode === self.options.keyCode.enter){
          var $this = $(this);
          $this.blur();
        }

      })
    },
    showTaskInfo:function () {
      var self = this;
      self.$detailBox.addClass('on');
      self.$todolist.addClass('detailOn');
    },
    hideTaskInfo:function () {
      var self = this;
      self.$detailBox.removeClass('on');
      self.$todolist.removeClass('detailOn');
    },
    render: function ($target, $tmpl, dataObj) {
      var tmpl = $tmpl.html();
      var html = ejs.render(tmpl, dataObj);
      $target.html(html);
    },
    renderTasklist: function () {
      var self = this;
      var fList = self.getFlist()||[], unfList = self.getUnflist()||[];
      var fListTemp = [], unfListTemp = [];
      if('today' === self.route.getRoute(0)){
        for (var k in fList) {
          var fDate = new Date(fList[k].fDate);
          if(Util.isToday(fDate)){
            fListTemp.push(fList[k]);
          }
        }
        fList = fListTemp;
        for (var k in unfList) {
          var fDate = new Date(unfList[k].fDate);
          if(Util.isToday(fDate)){
            unfListTemp.push(unfList[k]);
          }
        }
        unfList = unfListTemp;
      }
      self.render(self.$fList, self.$fListTmpl, {fList:fList});
      self.render(self.$unfList, self.$unfListTmpl, {unfList:unfList});
    },
    renderTaskInfo: function (task) {
      var self = this;
      self.render(self.$taskInfoBox, self.$taskInfoTmpl, {task:task});
    },
    delTask: function (id, callback) {
      var self = this;
      var tasklist = self.getTasklist();
      for (var i = 0; i < tasklist.length; i++) {
        if(tasklist[i].id === id){
          tasklist.splice(i,1);
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
        if(task.id === tasklist[k].id){
          type = 'update';
          for (var i in task) {
            tasklist[k][i] = task[i];
          }
          break;
        }
      }
      if(type === 'add'){
        task = $.fn.extend({
          "id":Util.uuid(),
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
      Util.store(self.options.tasklistName, tasklist);
    },
    getTasklist: function () {
      var self = this;
      return Util.store(self.options.tasklistName);
    },
    getFlist: function () {
      var self = this;
      var tasklist = self.getTasklist();
      var fList = [];
      for (var k in tasklist) {
        if(tasklist[k].isFinished){
          fList.push(tasklist[k]);
        }
      }
      fList.sort(function (a,b) {
        return a['fDate']>=b['fDate']?-1:1;
      });
      return fList;
    },
    getUnflist: function () {
      var self = this;
      var tasklist = self.getTasklist();
      var unfList = [];
      for (var k in tasklist) {
        if(!tasklist[k].isFinished){
          unfList.push(tasklist[k]);
        }
      }
      unfList.sort(function (a,b) {
        return a['fDate']>=b['fDate']?-1:1;
      });
      return unfList;
    },
    getTaskById: function (id) {
      var self = this;
      var tasklist = self.getTasklist();
      for (var k in tasklist) {
        if(tasklist[k].id === id){
          return tasklist[k];
        }
      }
      return false;
    }


  };

  App.init();
  window.App = App;

});
