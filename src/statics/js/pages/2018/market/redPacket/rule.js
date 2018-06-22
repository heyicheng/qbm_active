define(function(require, exports, module) {

  require('zepto');
  require('fastclick');
  require('layer');
  require('layerCss');

  FastClick.attach(document.body);

  $(function() {
    var App = function() {

      this.url = {
        type:  getUrlParam("type"),//页面类型
        userId: getUrlParam("userId"),//用户登录ID
      }

      this.init();

    };

    App.prototype = {
      init: function() {
        var self = this,
            userId = self.url.userId;

        console.log("webUrl="+webUrl);
        console.log("pcUrl="+pcUrl);

        if(userId == null || userId == "(null)"){
          userId = "";
        }

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
          bridge.init(function(message, responseCallback) {
            var data = {
              'Javascript Responds': 'Wee!'
            }
            responseCallback(data);
          });

          //页面返回按钮接口
          bridge.registerHandler('goBackBtnHandler', function(data, responseCallback){
            var backLink = webUrl + "/view/2018/market/redPacket/index.html?userId="+userId;
            var responseData = {'title': "谁领大红包",'href':backLink,'icon':1,'backBtn':0};
            responseCallback(responseData);
            if(typeof data=="string")data = JSON.parse(data);
            if(data.result) location.href = backLink;
          });

        });
        //E-APP交互相关
      },


    };

  var app = new App();

  });
});
