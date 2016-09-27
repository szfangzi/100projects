var Util = (function () {

    return {
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
        deepCopy:function(p, c){
       　　var c = c || {};
       　　for (var i in p) {
       　　　　if (typeof p[i] === 'object') {
       　　　　　　c[i] = (p[i].constructor === Array) ? [] : {};
       　　　　　　deepCopy(p[i], c[i]);
       　　　　} else {
       　　　　　　　c[i] = p[i];
       　　　　}
       　　}
       　　return c;
        },
        nodeRecursion:function(nodes, pid) {
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
    }
}());
