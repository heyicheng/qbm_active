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
      this.outSiteFun();

    };

    App.prototype = {
      init: function() {
        var self = this,
            userId = self.url.userId,
            systemTime = "",//系统时间
            startTime = "",//活动开始时间
            endTime = "",//活动结束时间
            dataCode = "";
        
        //用户登录状态处理
        if(self.url.userId == null || userId == "(null)"){
          userId = "";
        } 

        var sendInfo = {};

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
          bridge.callHandler('goLoadPageHandler',{'title':'谁领大红包','href':'','icon':0,'backBtn':0}, function(responseData) {
            if(typeof responseData=="string") responseData = JSON.parse(responseData);
            if(responseData.result) console.log("BANNER进入加载成功");
          });   

          var currentLink = location.href;

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
              systemTime = data.currentTime;
              startTime = data.startTime;
              endTime = data.endTime;              
              dataCode = data.code;
              //alert(dataCode);
              //活动已结束
              if(systemTime >= endTime){
                layer.open({
                  className: 'layer-tip',
                  content: "活动已结束",
                  shade: false,
                  time: 2
                });
              }
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


          //app版本号信息
          bridge.callHandler('getVersionHandler',{'ver': '1026'}, function(response) {
             if(typeof response=="string")response = JSON.parse(response);
             //alert("app当前版本："+response.ver);//APP版本号
             //alert("手机系统："+response.os);//手机系统
             //alert("手机系统版本："+response.phoneType);//手机版本
             
             if(versionToNum(response.ver) < 3150){
              layer.open({
                title: [
                  '温馨提示',
                  'background-color:#833cd3; color:#fff;'
                ],
                content: '请您更新至最新版本，方可享受在投资详情、购标完成后，正常分享拼手气红包活动哦！',
                shadeClose: false,
                btn: ['立即更新'],
                yes:function(){
                  var downLink = "http://a.app.qq.com/o/simple.jsp?pkgname=com.qianbaomu.view";
                  bridge.callHandler('goAppNewVersionHandler',{"href":downLink}, function(responseData) {
                    if(typeof responseData=="string")responseData = JSON.parse(responseData);
                    if(responseData.result) console.log("success");
                  });
                }
              });
             }
          });
          
          //页面返回按钮接口
          bridge.registerHandler('goBackBtnHandler', function(data, responseCallback){
            var backLink = webUrl + "/view/2017/thirdAnnicersary/index.html?interaction=1&userId="+userId;
            var responseData = {'title': "钱保姆三周年庆典",'href':backLink,'icon':0,'backBtn':1};
            responseCallback(responseData);
            if(typeof data=="string")data = JSON.parse(data);
            if(data.result) location.href = backLink;
          });

          //活动规则
          $(document).on('click', '#rule', function(){
            bridge.callHandler('goPageHandler',{'title': '活动规则','icon':0,'backBtn':0}, function(responseData) {
              if(typeof responseData=="string")responseData = JSON.parse(responseData);
              if(responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/redPacket/rule.html?userId="+userId;
            });
          });

          //去投资
          $(document).on('click', '#goInvestBtn', function(){
            if(systemTime >= endTime){
              layer.open({
                className: 'layer-tip',
                content: "活动已结束",
                shade: false,
                time: 2
              });
            }else{
              bridge.callHandler('goAppModule',{'target':'financing'}, function(responseData) {
                if(typeof responseData=="string")responseData = JSON.parse(responseData);
                if(responseData.result) console.log("success");
              });
            }
          });

          //返回主会场
          $(document).on('click', '#backBtn', function(){          
            bridge.callHandler('goPageHandler',{'title': '钱保姆三周年庆典','icon':1,'backBtn':1}, function(responseData) {
              if(typeof responseData=="string")responseData = JSON.parse(responseData);
              if(responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/index.html?interaction=1&userId="+userId;
            });
          });

          //分享按钮
          $(document).on('click', '#goShareBtn', function(){

            if(userId == ""){//未登录
              //分享信息
              sendInfo = {
                'shareTitle': '【三周年庆典】谁领大红包',
                'shareLink': webUrl +'/view/2017/thirdAnnicersary/redPacket/index.html?type=h5',
                'shareIntro':'拼手气，抢无门槛大红包！',
                'shareIcon': pcCdnUrl+'/images/shareIcon/znq.png'
              }

              bridge.callHandler('goSendShareInfoHandler',sendInfo, function(response) {
                if(typeof response=="string")response = JSON.parse(response);
                if(response.result) console.log("分享信息发送成功");
              });

              bridge.callHandler('goSharePopHandler',{'status': 1}, function(responseData) {
                if (typeof responseData == "string") responseData = JSON.parse(responseData);
                if (responseData.result) console.log("success");
              });
            }else{//已登录
              alert("已登录");
              // alert("dataCode="+dataCode);
              // alert("systemTime="+systemTime);
              // alert("startTime="+startTime);
              // alert("endTime="+endTime);
              if(systemTime >= startTime && systemTime <= endTime && dataCode == 1){//活动进行中-未分享

                alert("活动进行中");

                $.ajax({
                  url: pcUrl+'/hb/generateWtjShareHb.html',
                  type:"get",
                  data:{
                    "loginId": userId
                  },
                  dataType:"jsonp",
                  success:function(data){
                    if(typeof data=="string"){
                      data = $.parseJSON(data);
                    }

                    alert(data.wxTitle);

                    sendInfo = {
                      'shareTitle': data.wxTitle,
                      'shareLink': data.shareUrl,
                      'shareIntro':'谁领大红包，拼的是手气！',
                      'shareIcon': pcCdnUrl+'/images/shareIcon/znq.png'
                    }

                    bridge.callHandler('goSendShareInfoHandler',sendInfo, function(response) {
                      if(typeof response=="string")response = JSON.parse(response);
                      if(response.result) console.log("分享信息发送成功");
                    });

                    bridge.callHandler('goSharePopHandler',{'status': 1}, function(responseData) {
                      if (typeof responseData == "string") responseData = JSON.parse(responseData);
                      if (responseData.result) console.log("success");
                    });

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
                               
              }else if(systemTime > endTime){//活动已结束
                alert("活动已结束");
                layer.open({
                  className: 'layer-tip',
                  content: "活动已结束",
                  shade: false,
                  time: 2
                });
              }else{//活动未开始或已分享
                alert("活动未开始或已分享");
                //分享信息
                sendInfo = {
                  'shareTitle': '【三周年庆典】谁领大红包',
                  'shareLink': webUrl +'/view/2017/thirdAnnicersary/redPacket/index.html?type=h5',
                  'shareIntro':'拼手气，抢无门槛大红包！',
                  'shareIcon': pcCdnUrl+'/images/shareIcon/znq.png'
                }

                bridge.callHandler('goSendShareInfoHandler',sendInfo, function(response) {
                  if(typeof response=="string")response = JSON.parse(response);
                  if(response.result) console.log("分享信息发送成功");
                });
                bridge.callHandler('goSharePopHandler',{'status': 1}, function(responseData) {
                  if (typeof responseData == "string") responseData = JSON.parse(responseData);
                  if (responseData.result) console.log("success");
                });
              }
            }

          });

        });
        //E-APP交互相关
      },
      outSiteFun: function(){

        var self = this;
        var pageType = self.url.type;

        if(pageType == "h5"){

          //活动规则
          $("#rule").on("click",function(){
            location.href = webUrl + "/view/2017/thirdAnnicersary/redPacket/rule.html";
          });

          //分享立领-去投资
          $("#goShareBtn,#goInvestBtn").on("click",function(){
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
