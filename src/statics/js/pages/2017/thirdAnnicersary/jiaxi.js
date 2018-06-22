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

      this.time = {
        jiaxiStartTime: "1509465600",//拼手气抢红包活动开始时间 2017.11.1 0:0:0
        jiaxiEndTime: "1509724799",//拼手气抢红包活动结束时间 2017.11.3 23:59:59
      }

      this.init();
      this.outSiteFun();

    };

    App.prototype = {
      init: function() {
        var self = this,
            userId = self.url.userId,
            systemTime = "";


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

          //首次加载时调用接口
          bridge.callHandler('goLoadPageHandler',{'title':'加息三天乐','href':'','icon':2,'backBtn':0}, function(responseData) {
            if(typeof responseData=="string") responseData = JSON.parse(responseData);
            if(responseData.result) console.log("BANNER进入加载成功");
          });

          //获取系统时间
          $.ajax({
            url: pcUrl+'/hb/iconShow.html',
            type:"get",
            data:{
              "loginId": userId
            },
            dataType:"jsonp",
            success:function(data){
              if(typeof data=="string"){
                data = $.parseJSON(data);
              }
              console.log(data);
              systemTime = data.currentTime;

            },
            error:function(){
              layer.open({
                className: 'layer-tip',
                content: "数据请求失败",
                shade: false,
                time: 2
              });
            }
          });

          //当前页面链接
          var currentLink = location.href;

          //发送分享信息给APP
          var sendInfo = {
            'shareTitle': '【三周年庆典】加息三天乐',
            'shareLink': webUrl+'/view/2017/thirdAnnicersary/jiaxi.html?type=h5',
            'shareIntro':'全场加息,最高3%!',
            'shareIcon': pcCdnUrl+'/images/shareIcon/znq.png'
          }

          bridge.callHandler('goSendShareInfoHandler',sendInfo, function(response) {
            if(typeof response=="string")response = JSON.parse(response);
            if(response.result) console.log("分享信息发送成功");
          });

          //页面返回按钮接口
          bridge.registerHandler('goBackBtnHandler', function(data, responseCallback){
            var backLink = webUrl + "/view/2017/thirdAnnicersary/index.html?interaction=1&userId="+userId;
            var responseData = {'title': "钱保姆三周年庆典",'href':backLink,'icon':1,'backBtn':1};
            responseCallback(responseData);
            if(typeof data=="string")data = JSON.parse(data);
            if(data.result) location.href = backLink;
          });

          //立即购买
          $("#goFinancing").on("click",function(){
            if(systemTime >= self.time.jiaxiEndTime){
              layer.open({
                className: 'layer-tip',
                content: "活动已结束哦！",
                shade: false,
                time: 3
              });
            }else{
              bridge.callHandler('goAppModule',{'target':'financing'}, function(responseData) {
                if(typeof responseData=="string")responseData = JSON.parse(responseData);
                if(responseData.result) console.log("success");
              });
            }
          });

          //返回主会场
          $("#backBtn").on("click",function(){
            bridge.callHandler('goPageHandler',{'title': '钱保姆三周年庆典','icon':1,'backBtn':1}, function(responseData) {
              if(typeof responseData=="string")responseData = JSON.parse(responseData);
              if(responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/index.html?interaction=1&userId="+userId;
            });

          });

        });
        //E-APP交互相关
      },
      outSiteFun: function(){
        var self = this;
        var pageType = self.url.type;

        if(pageType == "h5"){

          //立即购买
          $("#goFinancing").on("click",function(){
            location.href = pcUrl+"/applink.html";
          });

          //返回主会场
          $("#backBtn").on("click",function(){
            location.href = webUrl + "/view/2017/thirdAnnicersary/index.html?type=h5";
          });
        }
      },  

    };

  var app = new App();

  });
});
