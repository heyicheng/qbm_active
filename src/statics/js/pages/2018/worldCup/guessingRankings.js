define(function(require,exports,module){

		require('zepto');
		require('fastclick');
		require('layer');
		require('layerCss');
		require("artTemplate4");
		require("artTemplateHelper");

		FastClick.attach(document.body);

		$(function() {
			var App = function(){

				this.url = {
					type: getUrlParam('type'),//页面类型,h5为分享页面
					userId: getUrlParam('userId'),//获取用户Id(加密)
				};

				this.init();//初始化页面数据
        this.artTemplateHelperFun();//template自定义函数
				this.app();//APP处理
				this.outSite();//非APP页面处理

			};

			App.prototype={
				init:function(){
					var self = this,
						  userId = self.url.userId;

	        if(userId == null || userId == "(null)"){
	        	userId = "";
     			}

					//页面初始化数据
          $.ajax({
              url: webUrl +'/worldcup/getLeaderboard.html',
              type:"get",
              data:{
                "userId": userId
              },
              dataType:"jsonp",
              success:function(res){
                if(typeof res == "string"){
                  res = $.parseJSON(res);
                }
                console.log(res);
                if(res.result){
                  var dataLength = res.dataList.length;
                  console.log(dataLength);
                  if(dataLength != 0){
                    //数据渲染
                    var html = template('dataListTpl', res);
                    $("#dataList").html(html);
                  }else{
                    //$("#dataList").html('<p class="text-center nodata">暂无记录</p>');
                  }
                }else{
                  layer.open({
                    className: 'layer-tip',
                    content: res.msg,
                    shade: false,
                    time: 1
                  });
                }
              },
              error:function(){
                layer.open({
                  className: 'layer-tip',
                  content: "数据请求失败",
                  shade: false,
                  time: 1
                });
              }
          });


				},
        artTemplateHelperFun: function() {
          var self = this;

          template.defaults.imports.lineFun = function(index) {
            if(index == 0){
              return 'line';
            }else{
              return '';
            }
					}

          template.defaults.imports.iconFun = function(index) {
            if(index == 0){
              return 'me';
            }else if(index == 1){
              return 'one';
            }else if(index == 2){
              return 'two';
            }else if(index == 3){
              return 'three';
            }else {
              return '';
            }
					}

          template.defaults.imports.showNameFun = function(name,index) {
            if(index == 0){
              return '我';
            }else{
              return name;
            }
					}

        },
        app:function(){
					var self = this,
						userId = self.url.userId;

          //用户登录状态处理
	        if(userId == null || userId == "(null)"){
	        	userId = "";
     			}

					//S-APP交互相关
					function connectWebViewJavascriptBridge(callback) {//判断APP是否支持WebViewJavascriptBridge
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
							var data = { 'Javascript Responds':'Wee!' }
							responseCallback(data);
						});

            //首次加载时调用接口
            bridge.callHandler('goLoadPageHandler', { 'title': '', 'href': '', 'icon': 1, 'backBtn': 0 }, function(responseData) {
                if (typeof responseData == "string") responseData = JSON.parse(responseData);
                if (responseData.result) console.log("重置参数成功!!");
            });

            //返回活动主页
            bridge.registerHandler('goBackBtnHandler', function(data, responseCallback) {
                var backLink = webUrl + "/view/2018/worldCup/index.html?interaction=1&userId=" + userId;
                var responseData = { 'title': "投标拿大奖，竞猜赢好礼", 'href': backLink, 'icon': 2, 'backBtn': 1 };
                responseCallback(responseData);
                if (typeof data == "string") data = JSON.parse(data);
                if (data.result) location.href = backLink;
            });

					});
					//E-APP交互相关
				},
				outSite: function(){
					var self = this;

          //分享页面处理
					if(self.url.type == 'h5'){


					}

				},


			};

			var app =new App();

		});
});
