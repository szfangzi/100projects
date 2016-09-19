(function($){

  $(window).on('hashchange', function (e) {
    $('.container').hide();
    if(location.hash == '#index'){
      $('#todolistPage').show(400);
    }else if(location.hash == '#test'){
      $('#testPage').show(400);
    }

  });
  $('.route').on('click','#routeIndex', function (e) {
    location.hash = '#index';
  }).on('click','#routeTest', function (e) {
    location.hash = '#test';
  });

  //初始化假数据
  var initId = 10;
  $.ajax({
    url:'../public/json/todolist.json',
    async:false,
    method:'GET',
    success: function (data) {
      window.tasklist = data;
    },
    fail: function (data) {
      console.log('error!',data);
    }
  });
  tasklistInit(window.tasklist);

  $('#todolistPage').on('keydown', '.addTask input', function (e) {
    var $this = $(this);
    var taskname = '';
    if(e.keyCode == 13){
      var tasklist = window.tasklist;
      taskname = $this.val();
      tasklist.push({
        id:initId,
        taskname:taskname,
        fDate:'',
        remark:'',
        isFinished:false
      });
      initId++;
      window.tasklist = tasklist;
      $this.val('');

      tasklistInit(window.tasklist);
    }

  }).on('dblclick', '#tasklist .item', function (e) {
    e.stopPropagation();
    var $this = $(this);
    var taskId = $this.attr('taskId');
    var task = getItem(window.tasklist, taskId);
    task.fdateFormat = task.fDate?new Date(task.fDate).Format('YYYY-MM-DD'):'';
    taskInfoInit(task);
    $('.todolist').addClass('detailOn');
    $('.detailBox').addClass('on');

  }).on('click', '#tasklist .item', function (e) {
    e.stopPropagation();
    var $this = $(this);
    $('#tasklist .item').removeClass('on');
    $this.addClass('on');

  }).on('click', '#tasklist .isFinished, .detailBox .isFinished', function (e) {
    e.stopPropagation();
    var $this = $(this);
    var tasklist = window.tasklist;
    var taskId = '';
    if($this.parents('#tasklist').length){
      taskId = $this.parents('.item').attr('taskId');
      $('.detailBox .isFinished').prop({checked:$this.prop('checked')});
    }else{
      taskId = $this.parents('.taskName').attr('taskId');
    }
    for (var k in tasklist) {
      if(tasklist[k].id == taskId){
        tasklist[k].isFinished = $this.prop('checked');
        tasklistInit(tasklist);
      }
    }
    tasklistInit(window.tasklist);
  }).on('click', '.listBox', function (e) {
    e.stopPropagation();
    if($('.todolist').hasClass('detailOn')){
      $('.detailBox .backBtn').click();
    }
  }).on('click', '.backBtn', function (e) {
    var $this = $(this);
    var tasklist = window.tasklist;
    var taskId = $('#taskInfoBox .taskName').attr('taskId');
    for (var k in tasklist) {
      if(tasklist[k].id == taskId){
        tasklist[k].fDateFormat = $('#taskDate').val();
        tasklist[k].fDate = new Date(tasklist[k].fDateFormat).getTime();
        tasklist[k].remark = $('#remark').val();
        tasklist[k].taskname = $('#taskname').val();
        tasklistInit(tasklist);
      }
    }
    $('.todolist').removeClass('detailOn');
    $('.detailBox').removeClass('on');

  });

  function taskInfoInit(task) {
    var tmpl = $('#taskInfoTmpl').html();
    var html = ejs.render(tmpl, { task: task });
    $('#taskInfoBox').html(html);
  }
  function tasklistInit(tasklist) {
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
    if(tasklist.length){
      var tmpl = $('#todolistTmpl').html();
      var html = ejs.render(tmpl, { fList: fList, unfList:unfList });
      $('#tasklist').html(html);
    }

  }

  function getItem(list, id) {
    for (var k in list) {
      if(list[k].id == id){
        return list[k];
      }
    }
    return {};
  }


}(jQuery));
