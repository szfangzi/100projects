App.controller = (function () {

    var model = App.model;

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
                var task = model.getTaskById(taskId);
                self.renderTaskInfo(task);
                self.showTaskInfo();
                if(task.isFinished){
                    $('.finishedBtn').addClass('on');
                    App.$fList.addClass('on');
                }
                $('#tasklist .item[taskId="'+taskId+'"]').click();
            }
        },
        bindEvent: function () {
            var self = this;

            $(window).on('keydown', function (e) {
                e.stopPropagation();
                if(e.keyCode === App.options.keyCode.esc){
                    self.hideTaskInfo();
                }
            });

            App.$container.on('keydown', '#addTaskInput', function (e) {
                var $this = $(this);
                if(e.keyCode == App.options.keyCode.enter){
                    var taskname = $.trim($this.val());
                    model.updateTasklist({taskname:taskname}, function () {
                        self.renderTasklist();
                        $this.val('');
                    });

                }

            }).on('click', '.finishedBtn', function (e) {
                e.stopPropagation();
                var $this = $(this);
                $this.toggleClass('on');
                App.$fList.toggleClass('on');
            }).on('click', '#tasklist .isFinished, #taskInfoBox .isFinished', function (e) {
                e.stopPropagation();
                var $this = $(this);
                var taskId = '0';
                if($this.parents('.item').length){
                    taskId = $this.parents('.item').attr('taskId');
                }else{
                    taskId = $this.parents('.taskName').attr('taskId');
                }
                model.updateTasklist({id:taskId, isFinished:$this.prop('checked')}, function () {
                    self.renderTasklist();
                    if($this.parents('.item').length){
                        var task = model.getTaskById(taskId);
                        self.renderTaskInfo(task);
                    }
                    if($this.prop('checked')){
                        App.audioComplete.load();
                        App.audioComplete.play();
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
                App.$tasklist.find('.item').removeClass('on');
                $this.addClass('on');

            }).on('click', '#taskInfoBox .backBtn, #todolist .main', function (e) {
                e.stopPropagation();
                if($.inArray('task', self.route.getRoute()) !== -1){
                    self.hideTaskInfo();
                    self.route.setRoute(self.route.getRoute(0));
                }

            }).on('click', '#taskInfoBox .delBtn', function (e) {
                var $this = $(this);
                var taskId = App.$taskInfoBox.find('.taskName').attr('taskId');
                model.delTask(taskId, function () {
                    self.hideTaskInfo();
                    self.renderTasklist();
                });
            }).on('blur', '#taskInfoBox input[name="fDate"]', function(e){
                var $this = $(this);
                var taskId = App.$taskInfoBox.find('input[name="id"]').val();
                var fDate = $this.val();
                var fDateTimestamp = new Date(fDate).getTime();
                model.updateTasklist({id:taskId, fDate:fDateTimestamp}, function () {
                    if(Util.isPassedDate(fDateTimestamp)){
                        $this.parents('li').addClass('passed');
                    }else{
                        $this.parents('li').removeClass('passed');
                    }
                    self.renderTasklist();
                });

            }).on('blur', '#taskInfoBox input[name="remark"]', function(e){
                var $this = $(this);
                var taskId = App.$taskInfoBox.find('input[name="id"]').val();
                var remark = $this.val();
                model.updateTasklist({id:taskId, remark:remark}, function () {
                    self.renderTasklist();
                });

            }).on('keydown', '#taskInfoBox input[name="remark"]', function(e){
                if(e.keyCode === App.options.keyCode.enter){
                    var $this = $(this);
                    $this.blur();
                }

            })
        },
        render: function ($target, $tmpl, dataObj) {
            var tmpl = $tmpl.html();
            var html = ejs.render(tmpl, dataObj);
            $target.html(html);
        },
        renderTasklist: function () {
            var self = this;
            var fList = model.getFlist()||[], unfList = model.getUnflist()||[];
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
            self.render(App.$fList, App.$fListTmpl, {fList:fList});
            self.render(App.$unfList, App.$unfListTmpl, {unfList:unfList});
        },
        renderTaskInfo: function (task) {
            var self = this;
            self.render(App.$taskInfoBox, App.$taskInfoTmpl, {task:task});
        },
        showTaskInfo:function () {
            var self = this;
            App.$detailBox.addClass('on');
            App.$todolist.addClass('detailOn');
        },
        hideTaskInfo:function () {
            var self = this;
            App.$detailBox.removeClass('on');
            App.$todolist.removeClass('detailOn');
        }
    }
}());
