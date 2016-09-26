var App = (function () {

    var defaults = {
        keyCode:{
            enter:13,
            esc:27
        },
        baseUrl:'/100projects/todolist/src/jquery'
    };

    function jQueryDomInit() {
        this.$container = $('#container');
        this.$addTaskInput = $('#addTaskInput');
        this.$todolist = $('#todolist');
        this.$detailBox = $('#detailBox');
        this.$tasklist = $('#tasklist');
        this.$fList = $('#fList');
        this.$fListTmpl = $('#fListTmpl');
        this.$unfList = $('#unfList');
        this.$unfListTmpl = $('#unfListTmpl');
        this.$taskInfoBox = $('#taskInfoBox');
        this.$taskInfoTmpl = $('#taskInfoTmpl');
        this.audioNotification = document.querySelector('#audio-notification');
        this.audioComplete = document.querySelector('#audio-complete');
    }

    return {
        init: function (options) {
            var self = this;
            self.options = {};
            $.fn.extend(self.options, defaults, options);

            jQueryDomInit.apply(self);

            var tasklist = self.model.getTasklist();
            if(tasklist.length <= 0){
                self.model.init();
            }
            self.controller.init();

            return self;
        }
    }
}());
