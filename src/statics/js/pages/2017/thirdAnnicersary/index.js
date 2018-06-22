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
        redPacketStartTime: "1509465600",//拼手气抢红包活动开始时间 2017.11.1 0:0:0
        redPacketEndTime: "1511020800",//拼手气抢红包活动结束时间 2017.11.19 23:59:59
        chouDuiStartTime: "1510243200",//抽兑iPhone随心意活动开始时间 2017.11.13 0:0:0
        // chouDuiStartTime: "1509465600",//
        chouDuiEndTime:"1512057599",//抽兑iPhone随心意活动结束时间 2017-11-30 23:59:59
      }

      this.init();
      this.outSideFun();

    };

    App.prototype = {
      init: function() {
        var self = this,
            userId = self.url.userId,
            systemTime = "";
            
        //用户登录状态处理
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
          //加载页面后调用
          bridge.init(function(message, responseCallback) {
            var data = {
              'Javascript Responds': 'Wee!'
            }
            responseCallback(data);
          });


          //首次加载时调用接口
          bridge.callHandler('goLoadPageHandler',{'title':'','href':'','icon':2,'backBtn':1}, function(responseData) {
            if(typeof responseData=="string") responseData = JSON.parse(responseData);
            if(responseData.result) console.log("BANNER进入加载成功");
          });

          //发送分享信息给APP
          var sendInfo = {
            'shareTitle': '钱保姆三周年庆典',
            'shareLink': webUrl+'/view/2017/thirdAnnicersary/index.html?type=h5',
            'shareIntro':'加息、红包、iPhone X送不停！',
            'shareIcon': pcCdnUrl+'/images/shareIcon/znq.png'
          }

          bridge.callHandler('goSendShareInfoHandler',sendInfo, function(response) {
            if(typeof response=="string")response = JSON.parse(response);
            if(response.result) console.log("分享信息发送成功");
          });


          //app版本号信息
          bridge.callHandler('getVersionHandler',{'ver': '1026'}, function(response) {
            if(typeof response=="string")response = JSON.parse(response);
            var appVersion = response.ver,//app版本
                phoneOS = response.os,//系统
                phoneType = response.phoneType;//机型

            // alert(appVersion);
            // alert(phoneOS);
            // alert(phoneType);

            if(phoneOS == "android"){
              if(appVersion == "3.1.4" || appVersion == "3.1.5"){
                //$("#videoBox").addClass("hide");
              }else{
                $("#videoBox").removeClass("hide");
              }
            }else{
              $("#videoBox").removeClass("hide");
            }

             
          }); 

          //获取系统时间及用户状态
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
              // if(data.code == -3 && systemTime >= self.time.chouDuiStartTime){
              //   $("#shareBtn").removeClass("hide").removeClass("shareBtn").addClass("qiandouBtn");
              // }else{
              //   //分享按钮
              //   $("#shareBtn").removeClass("hide");
              // }

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

          //返回链接
          var currentLink = location.href;
          
          //加息三天乐
          $(document).on('click', '#goJiaXi', function(){
            bridge.callHandler('goPageHandler',{'title': '加息三天乐','icon':2,'backBtn':0}, function(responseData) {
              if(typeof responseData=="string")responseData = JSON.parse(responseData);
              if(responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/jiaxi.html?interaction=1&userId="+userId;
            });
          });

          //拼手气红包
          $(document).on('click', '#goRedpacket', function(){
            bridge.callHandler('goPageHandler',{'title': '谁领大红包','icon':2,'backBtn':0}, function(responseData) {
              if(typeof responseData=="string")responseData = JSON.parse(responseData);
              if(responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/redPacket/index.html?interaction=1&userId="+userId;
            });
          });

          //限时抢券
          $(document).on('click', '#goQiangGou', function(){
            bridge.callHandler('goPageHandler',{'title': '限时抢券，精品相赠','icon':2,'backBtn':0}, function(responseData) {
              if(typeof responseData=="string")responseData = JSON.parse(responseData);
              if(responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/finLife/grabTicket.html?interaction=1&userId="+userId;
            });
          });

          //11.11生活圈钜惠
          $(document).on('click', '#goFinLife', function(){
            bridge.callHandler('goPageHandler',{'title': '限时狂欢，够畅快','icon':2,'backBtn':0}, function(responseData) {
              if(typeof responseData=="string")responseData = JSON.parse(responseData);
              if(responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/finLife/shopping.html?interaction=1&userId="+userId;
            });
          });

          //一起携手，登三望远
          $(document).on('click', '#footerBtn', function(){
            bridge.callHandler('goPageHandler',{'title': '登“三”望远，正当时','icon':2,'backBtn':0}, function(responseData) {
              if(typeof responseData=="string")responseData = JSON.parse(responseData);
              if(responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/about/index.html?interaction=1&userId="+userId;
            });
          });

          //集钱豆
          $(document).on('click', '#goJiQianDou', function(){

            if(systemTime >= self.time.chouDuiStartTime){
              bridge.callHandler('goPageHandler',{'title': '抽兑iPhone随心意','icon':2,'backBtn':0}, function(responseData) {
                if(typeof responseData=="string")responseData = JSON.parse(responseData);
                if(responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/lottery/index.html?interaction=1&userId="+userId;
              });
            }else{
              layer.open({
                className: 'layer-tip',
                content: "11月13日精彩上线，敬请期待~",
                shade: false,
                time: 3
              });
            }   

          });

          //分享按钮
          $(document).on('click', '#shareBtn', function(){
            if(systemTime >= self.time.chouDuiStartTime){//抽兑iphone随心意
              bridge.callHandler('goPageHandler',{'title': '抽兑iPhone随心意','icon':2,'backBtn':0}, function(responseData) {
                if(typeof responseData=="string")responseData = JSON.parse(responseData);
                if(responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/lottery/index.html?interaction=1&userId="+userId;
              });
            }else{//谁领大红包
              bridge.callHandler('goPageHandler',{'title': '谁领大红包','icon':2,'backBtn':0}, function(responseData) {
                if(typeof responseData=="string")responseData = JSON.parse(responseData);
                if(responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/redPacket/index.html?interaction=1&userId="+userId;
              });
            }
          });


        });
        //E-APP交互相关
      },
      outSideFun: function(){
        var self = this,
            pageType = self.url.type,
            systemTime = "";

        console.log("pageType="+pageType);

        if(pageType == "h5"){

          $("#videoBox").removeClass("hide");

          var userId = "";
          //获取系统时间及用户状态
          $.ajax({
            url: pcUrl +'/hb/iconShow.html',
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

          //一起携手
          $(document).on('click', '#footerBtn', function(){
            location.href = webUrl + "/view/2017/thirdAnnicersary/about/index.html?type=h5";
          });

          //加息三天乐
          $(document).on('click', '#goJiaXi', function(){
            location.href = webUrl + "/view/2017/thirdAnnicersary/jiaxi.html?type=h5";
          });

          //拼手气红包
          $(document).on('click', '#goRedpacket', function(){
            location.href = webUrl + "/view/2017/thirdAnnicersary/redPacket/index.html?type=h5";
          });

          //限时抢购
          $(document).on('click', '#goQiangGou', function(){
            location.href = webUrl + "/view/2017/thirdAnnicersary/finLife/index.html?type=h5"
          });

          //11.11生活圈钜惠
          $(document).on('click', '#goFinLife', function(){
            location.href = webUrl + "/view/2017/thirdAnnicersary/finLife/shopping.html?type=h5";
          });

          //集钱豆
          $(document).on('click', '#goJiQianDou', function(){
            if(systemTime >= self.time.chouDuiStartTime){
              location.href = webUrl + "/view/2017/thirdAnnicersary/lottery/index.html?type=h5";
            }else{
              layer.open({
                className: 'layer-tip',
                content: "11月13日精彩上线，敬请期待~",
                shade: false,
                time: 2
              });
            }   
          });

          //分享按钮
          $(document).on('click', '#shareBtn', function(){
            if(systemTime >= self.time.chouDuiStartTime){//抽兑iphone随心意活动开启
              location.href = webUrl + "/view/2017/thirdAnnicersary/lottery/index.html?type=h5";
            }else{//谁领大红包
              bridge.callHandler('goPageHandler',{'title': '谁领大红包','icon':2,'backBtn':0}, function(responseData) {
                location.href = webUrl + "/view/2017/thirdAnnicersary/redPacket/index.html?type=h5";
              });
            }
          });


        }
      },


    };

  var app = new App();

  });
});
