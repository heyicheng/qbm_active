define(function(require, exports, module) {

  require('zepto');
  require('fastclick');

  FastClick.attach(document.body);

  $(function() {

    var App = function() {

      this.url = {
        loginId: getUrlParam('userId'),
        type: getUrlParam('type'),
      };
      this.init();
      this.operation();
    };

    App.prototype = {
      init: function() {
        var self = this,
            loginId = self.url.loginId;

        //用户登录状态处理

        if(loginId == null || loginId == "(null)"){
          loginId = "";
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

          //加载页面后调用
          bridge.init(function(message, responseCallback) {
            var data = {
              'Javascript Responds': 'Wee!'
            }
            responseCallback(data);
          });

          bridge.callHandler('goLoadPageHandler', {'title': '','href': '','icon': 2,'backBtn': 1}, function(responseData) {
            if (typeof responseData == "string") responseData = JSON.parse(responseData);
            if (responseData.result) console.log("重置参数成功!!");
          });

          

          $(document).on('click',".ruleBtn",function(){
            bridge.callHandler('goPageHandler',{'title':'活动规则','icon':0,'backBtn':0},function(responseData){
              if(typeof responseData=="string")responseData = JSON.parse(responseData);
              if(responseData.result) location.href = webUrl + "/view/2017/superAgent/rule.html?userId="+loginId;
            });
          });

          $(document).on('click',".invBtn",function(){//二维码弹框
            if(loginId == ""){//未登录
              bridge.callHandler('goLoginHandler',{'href': webUrl+'/view/2017/superAgent/index.html?interaction=1'}, function(responseData) {
                if(typeof responseData=="string")responseData = JSON.parse(responseData);
                if(responseData.result) console.log("success");
              });
            }else{//已登录
              var sendQRCodeInfo = {
                'shareTitle': '【超级经纪人】快人一步，尊享iPhone8！',
                'shareLink': pcUrl + '/broker/toIndexPage.html?loginId='+loginId,
                'shareContent': '邀好友赢300元红包，更有ipad Pro、kindle、油卡等超值大礼！你心动了吗？',
                'shareIcon': pcCdnUrl + '/images/shareIcon/20170421.png',
                'popText':"邀请好友扫二维码开启投资新时代"
              }
              bridge.callHandler('goShareQRCodeHandler',sendQRCodeInfo, function(response) {
                if(typeof responseData=="string")responseData = JSON.parse(responseData);
                if(responseData.result) console.log("success");
              });
            }
            
          });

          $(document).on('click',".moreBtn",function(){
            bridge.callHandler('goPageHandler',{'title':'经纪人权益','icon':0,'backBtn':0},function(responseData){
              if(typeof responseData=="string")responseData = JSON.parse(responseData);
              if(responseData.result) location.href = wapUrl + "/superAgent/onLine/equity.html?userId="+loginId+"&from=h5";
            });
          });
        });
        //E-APP交互相关
      },

      operation:function(){
        var self = this;
        dataFun();

        function dataFun(){
          $.ajax({
            type:"get",
            url: webUrl + "/broker/getBrokerInviteInfo.html",
            data: {
  						userId: self.url.loginId,
  					},
            dataType:"jsonp",
            success: function(data){
              console.log(data);
              if(typeof responseData == "string"){
                data = JSON.parse(data);
              }
              if(data.result){
                $(".people em").html(data.count);
                $(".money em").html(data.money);
              }
            }
          })
        };

        if(self.url.type == 'h5'){
          $(document).on("click",".ruleBtn",function(){//跳转到活动规则页
            location.href = webUrl + "/view/2017/superAgent/rule.html?userId="+self.url.loginId;
          })
        }
        
        // $(document).on("click",".moreBtn",function(){//跳转到活动规则页
        //   location.href = webUrl + "/superAgent/onLine/equity.html?userId="+self.url.loginId;
        // })
      }

    };

   var app = new App();

  });
});
