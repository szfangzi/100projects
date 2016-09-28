App.controller = (function () {

  var model = App.model;
  var routeFilter = 'all';
  var currentListId = "0";

  return {
    init: function () {
      var self = this;
      self.bindEvent();
      self.initRoute();
    },
    initRoute: function () {
      var self = this;
      new Router({
        '/': {
          once: function () {
            self.route = this;
            self.renderNavList();
          },
          '/all': {
            on: function () {
              self.routeChangeHandler('all', "0");
            },
            '/task/:taskId': function (taskId) {
              self.routeTaskHandler(taskId);
            }
          },
          '/today': {
            on: function () {
              self.routeChangeHandler('today', "0");
            },
            '/task/:taskId': function (taskId) {
              self.routeTaskHandler(taskId);
            }
          },
          '/list-:listId':{
            on: function (listId) {
              self.routeChangeHandler('list', listId);
            },
            '/task/:taskId': function (listId, taskId) {
              self.routeTaskHandler(taskId);
            }
          }
        }

      }).configure({
          recurse: 'forward',
          notfound: function () {
            window.location.hash = '/all';
          }
        }).init('/all');

    },
    bindEvent: function () {
      var self = this;

      $(window).on('keydown', function (e) {
        e.stopPropagation();
        if (e.keyCode === App.options.keyCode.esc) {
          self.hideTaskInfo();
        }
      });

      App.$container.on('click', '.item-directory, .item-list', function (e) {

        var $this = $(this);
        if ($this.hasClass('item-list')) {
          $('nav .item-list').removeClass('on');
          $this.addClass('on');
        }else{
          $this.toggleClass('on');
        }

      }).on('keydown', '#addTaskInput', function (e) {
        var $this = $(this);
        if (e.keyCode == App.options.keyCode.enter) {
          var newTask = {};
          var taskname = $.trim($this.val());
          newTask = {
            taskname:taskname,
            listId:currentListId
          };
          if (routeFilter === "today") {
            newTask.fDate = new Date().getTime();
          }
          model.updateTaskList(newTask, function () {
            self.renderTaskList();
            self.renderNavList();
            $this.val('');
          });

        }

      }).on('click', '.finishedBtn', function (e) {

        var $this = $(this);
        $this.toggleClass('on');
        App.$fList.toggleClass('on');
      }).on('click', '#tasklist .isFinished, #taskInfoBox .isFinished', function (e) {

        var $this = $(this);
        var taskId = '0';
        if ($this.parents('.item').length) {
          taskId = $this.parents('.item').attr('taskId');
        } else {
          taskId = $this.parents('.taskName').attr('taskId');
        }
        model.updateTaskList({id: taskId, isFinished: $this.prop('checked')}, function () {
          self.renderTaskList(currentListId);
          if ($this.parents('.item').length) {
            var task = model.getTask(taskId);
            self.renderTaskInfo(task);
          }
          if ($this.prop('checked')) {
            App.audioComplete.load();
            App.audioComplete.play();
          }
          self.renderNavList();
        });

      }).on('dblclick', '#tasklist .item', function (e) {
        e.stopPropagation();
        var $this = $(this);
        var taskId = $this.attr('taskId') || "0";
        self.route.setRoute(self.route.getRoute(0) + '/task/' + taskId);

      }).on('click', '#tasklist .item', function (e) {

        var $this = $(this);
        App.$tasklist.find('.item').removeClass('on');
        $this.addClass('on');

      }).on('click', '#taskInfoBox .backBtn, #todolist .main', function (e) {

        if ($.inArray('task', self.route.getRoute()) !== -1) {
          self.hideTaskInfo();
          self.route.setRoute(self.route.getRoute(0));
        }

      }).on('click', '#taskInfoBox .delBtn', function (e) {
        var $this = $(this);
        var taskId = App.$taskInfoBox.find('.taskName').attr('taskId');
        model.delTask(taskId, function () {
          self.hideTaskInfo();
          self.renderTaskList();
          self.renderNavList();
        });
      }).on('blur', '#taskInfoBox input[name="fDate"]', function (e) {
        var $this = $(this);
        var taskId = App.$taskInfoBox.find('input[name="id"]').val();
        var fDate = $this.val();
        var fDateTimestamp = new Date(fDate).getTime();
        model.updateTaskList({id: taskId, fDate: fDateTimestamp}, function () {
          if (Util.isPassedDate(fDateTimestamp)) {
            $this.parents('li').addClass('passed');
          } else {
            $this.parents('li').removeClass('passed');
          }
          self.renderTaskList();
          self.renderNavList();
        });

      }).on('blur', '#taskInfoBox input[name="remark"]', function (e) {
        var $this = $(this);
        var taskId = App.$taskInfoBox.find('input[name="id"]').val();
        var remark = $this.val();
        model.updateTaskList({id: taskId, remark: remark}, function () {
          self.renderTaskList();
        });

      }).on('keydown', '#taskInfoBox input[name="remark"]', function (e) {
        if (e.keyCode === App.options.keyCode.enter) {
          var $this = $(this);
          $this.blur();
        }

      }).on('contextmenu', function (e) {
        //e.preventDefault();
        //$('#myMenu').css({top: e.clientY, left: e.clientX}).show();

      }).on('click', function (e) {
        //e.preventDefault();
        //$('#myMenu').hide();

      }).on('dragstart', '#tasklist .item', function (e) {
        var $this = $(this);
        $(this.outerHTML).attr({id:'drag-task'}).appendTo('body');
        e.originalEvent.dataTransfer.setData('taskId',$this.attr('taskId'));
        e.originalEvent.dataTransfer.setDragImage(document.querySelector('#dragMouseImg'),0,0);

      }).on('drag', '#tasklist .item', function (e) {
        var $this = $(this);

        $('#drag-task').attr({'style':'position: fixed;top:'+ (e.clientY)+'px;left:'+ (e.clientX)+"px"});

      }).on('dragend', '#tasklist .item', function (e) {

        $('#drag-task').remove();
        $('nav .item-list').removeClass('dragover');

      }).on('drop', 'nav .item-list', function (e) {
        var $this = $(this);
        var taskId = e.originalEvent.dataTransfer.getData('taskId');
        var listId = $this.attr('item-id');
        var task = model.getTask(taskId);
        task.listId = listId;
        model.updateTaskList(task, function () {
          self.renderTaskList();
          self.renderNavList();
        });
        $('#drag-task').remove();

      }).on('dragover', 'nav .item-list', function (e) {
        e.preventDefault();
        var $this = $(this);
        $('nav .item-list').removeClass('dragover');
        $this.addClass('dragover');
      })

    },
    render: function ($target, $tmpl, dataObj) {
      var tmpl = $tmpl.html();
      var html = ejs.render(tmpl, dataObj);
      $target.html(html);
    },
    renderNavList: function () {
      var self = this;
      var navObj = model.getNavListRecursion();

      self.render(App.$navBox, App.$navTmpl, {navObj:navObj});
    },
    renderTaskList: function () {
      var self = this;
      var tasklistObj = model.getTaskList(routeFilter, currentListId) || {};
      var fList = tasklistObj.fTmpList || [], unfList = tasklistObj.unfTmpList || [];

      self.render(App.$fList, App.$fListTmpl, {fList: fList});
      self.render(App.$unfList, App.$unfListTmpl, {unfList: unfList});
    },
    renderTaskInfo: function (task) {
      var self = this;
      self.render(App.$taskInfoBox, App.$taskInfoTmpl, {task: task});
    },
    showTaskInfo: function () {
      var self = this;
      App.$detailBox.addClass('on');
      App.$todolist.addClass('detailOn');
    },
    hideTaskInfo: function () {
      var self = this;
      App.$detailBox.removeClass('on');
      App.$todolist.removeClass('detailOn');
    },
    routeChangeHandler: function (filter, listId) {
      routeFilter = filter;
      currentListId = listId;
      var self = this;
      if(routeFilter === "all"){
        $('.menu-filter-all .item-list').click();
      }else if(routeFilter === "today"){
        $('.menu-filter-today .item-list').click();
      }else if(routeFilter === "list"){
        $('.item-list[item-id='+currentListId+']').click();
      }

      if(routeFilter === "today"){
        App.$addTaskInput.prop('placeholder', '添加一个今天的任务');
      }else{
        App.$addTaskInput.prop('placeholder', '添加一个任务');
      }
      self.hideTaskInfo();
      self.renderTaskList(currentListId);
    },
    routeTaskHandler:function(taskId) {
      var self = this;
      var task = model.getTask(taskId);
      self.renderTaskInfo(task);
      self.showTaskInfo();
      if (task.isFinished) {
        $('.finishedBtn').addClass('on');
        App.$fList.addClass('on');
      }
      $('#tasklist .item[taskId="' + taskId + '"]').addClass('on');
    }

  }
}());
