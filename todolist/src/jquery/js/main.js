(function($){

  var util = {
    store: function (name, data) {
      var data = data || [];
      if(arguments.length > 1){
        localStorage[name] = JSON.stringify(data);
      }else{
        var store = localStorage[name];
        return (store && JSON.parse(store)) || [];
      }

    },
    dateFormat: function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  };
  var app = {
    testData: function () {
      $.ajax({
        url:'../public/json/todolist.json',
        method:'GET',
        async:false,
        success: function (rs) {
          console.log(rs);
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
        tasklistName:'tasklist'
      };
      self.options = {};
      $.fn.extend(self.options, self.defaults, options);

      self.tasklist = util.store(self.options.tasklistName);
      if(self.tasklist.length <= 0){
        self.tasklist = self.testData();
      }
      self.$container = $('#container');
      self.$tasklist = $('#tasklist');
      self.$taskInfoBox = $('#taskInfoBox');
      self.$addTaskInput = $('#addTaskInput');

      self.initRoute();
      self.bindEvent();

      return self;
    },
    initRoute: function () {
      var self = this;
      var route = new Router({
        '/:filter': function (filter) {
          this.filter = filter;
          this.render();
        }.bind(this)
      }).init('/all');
      route.on('/all', function () {

      });
      route.on('today', function () {

      });
    },
    bindEvent: function () {
      var self = this;
      self.$container.on('')
    },
    render: function (targetId, tmplId, data) {

    },
    getTasklist: function () {

    }


  };

  app.init();
  window.app = app;

}(jQuery));
