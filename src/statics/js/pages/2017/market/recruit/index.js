define(function(require, exports, module) {

  require('zepto');
  require('fastclick');

  FastClick.attach(document.body);

  $(function() {
    var phoneSystem = ""; //手机系统

    //参数处理,获取用户id
    function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }

    var App = function() {

      this.url = {
        loginId: getUrlParam('userId'),
      };
      this.init();

    };

    App.prototype = {
      init: function() {
        var self = this;
        //S-APP交互相关
        function connectWebViewJavascriptBridge(callback) { //判断APP是否支持WebViewJavascriptBridge
          if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
          } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
              callback(WebViewJavascriptBridge)
            }, false)
          }
        }

        connectWebViewJavascriptBridge(function(bridge) {

          //加载页面后调用
          bridge.init(function(message, responseCallback) {
            var data = {
              'Javascript Responds': 'Wee!'
            }
            responseCallback(data);
          });
          bridge.callHandler('goLoadPageHandler',{'title':'','href':'','icon':1,'backBtn':1}, function(responseData) {
            if(typeof responseData=="string") responseData = JSON.parse(responseData);
            if(responseData.result) console.log("BANNER进入加载成功");
          });

        });
        //E-APP交互相关
      },


    };

   const app = new App();

  });
});
