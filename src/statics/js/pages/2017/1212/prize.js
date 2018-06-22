define(function(require,exports,module){

		require('zepto');
		require('fastclick');
		require("artTemplate4");
		require("artTemplateHelper");
		FastClick.attach(document.body);

		$(function() {

			var App = function(){

				this.url = {
					userId: getUrlParam('userId')
				};
				this.init();
				this.dataList();
			};

			App.prototype={

				init:function(){

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
						//返回抽奖
						bridge.registerHandler('goBackBtnHandler', function(data, responseCallback){
				            var backLink = webUrl + "/view/2017/1212/draw.html?interaction=1&userId=" + self.url.userId;
				            var responseData = {'title': "钱保姆",'href':backLink,'icon':1,'backBtn':1};
				            responseCallback(responseData);
				            if(typeof data=="string")data = JSON.parse(data);
				            if(data.result) location.href = backLink;
				        });

					});
					//E-APP交互相关
				},
				dataList:function(){
					var self = this,
						userId = self.url.userId;
		            
			        //用户登录状态处理
			        if(userId == null || userId == "(null)"){
			        	userId = "";
	       			} 

	       			//列表请求
			        $.ajax({
			            url: webUrl+'/beans/prizesList.html',
			            type:"get",
			            data:{
			            	"userId": userId
			            },
			            dataType:"jsonp",
			            success:function(data){
			              if(typeof data=="string"){
			                data = $.parseJSON(data);
			              }
			              console.log(data);
			              if(data.result){
			              	var dataLength = data.data.length;
			              	if(dataLength == 0){
			              		$("#list").html('<p class="no-data text-center">您暂未获得奖品哦！</p>')
			              	}else{
			              		var html = template('list-template', data);
								$("#list").html(html);
			              	}
			              }
			              
			            },
			            error:function(){
			              layer.open({
			                className: 'layer-tip',
			                content: "数据请求失败",
			                shade: true,
				            shadeClose: false,
			                time: 2
			              });
			            }
			        });
				},

			};

			var app =new App();

		});
});
