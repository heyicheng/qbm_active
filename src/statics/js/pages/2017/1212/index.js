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
					type: getUrlParam('type'),
					userId: getUrlParam('userId'),
					from: getUrlParam('from')
				};

				this.time = {
					startTime: 1512748800,//2017-12-09 00:00:00
					endTime: 1513353599,//2017-12-15 23:59:59
				}

				this.init();//初始化页面数据
				this.app();//APP处理
				this.outSite();//非APP页面处理

			};

			App.prototype={

				init:function(){					
					var self = this,
						userId = self.url.userId,
		            	systemTime = "";
		            
			        //用户登录状态处理
			        if(userId == null || userId == "(null)"){
			        	userId = "";
	       			} 

	       			//tab切换
	       			$(document).on("click","#tab li",function(){
	       				var dataType = $(this).attr("data-type");
	       				$(this).addClass("active").siblings().removeClass("active");
	       				var index = $(this).index();
	       				if(index == 2){
	       					$(".tab").scrollLeft(200);
	       				}
	       				$(".goods-list").addClass("hide");
	       				$(".goods-list").eq(index).removeClass("hide");
	       			});

	       			//请求活动状态
			        $.ajax({
			            url: webUrl+'/anniversary/lotteryTime.html',
			            type:"get",
			            dataType:"jsonp",
			            success:function(data){
			              if(typeof data=="string"){
			                data = $.parseJSON(data);
			              }
			              console.log(data);
			              if(data.status == 3){//活动暂未开始
			              	layer.open({
				                className: 'layer-tip',
				                content: "活动暂未开始",
				                shade: true,
				                shadeClose: false,
				                time: 3
				            });
			              }

			              // if(data.status == 1){//活动进行中
			              // 	$(".priceEnd").addClass("hide");
			              // 	$(".priceStart").removeClass("hide");
			              // }

			              if(data.status == 2){//活动已结束

			              	layer.open({
				                className: 'layer-tip',
				                content: "活动已结束",
				                shade: true,
				                shadeClose: false,
				                time: 2
				            });
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

				app:function(){					
					var self = this,
						userId = self.url.userId,
						backLink = webUrl + '/view/2017/1212/index.html?interaction=1';
		            
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

						//跳转至活动规则
						$(document).on('click',"#ruleBtn",function(){
							bridge.callHandler('goPageHandler',{'title': '活动规则','icon':0,'backBtn':0}, function(responseData) {
				              if(typeof responseData=="string")responseData = JSON.parse(responseData);
				              if(responseData.result) location.href = webUrl +  "/view/2017/1212/rule.html?interaction=1&userId=" + userId;
				            });
						});


						//跳转至抽奖页面
						$(document).on('click',"#drawBtn",function(){
							bridge.callHandler('goPageHandler',{'title': '钱保姆','icon':0,'backBtn':0}, function(responseData) {
				              if(typeof responseData=="string")responseData = JSON.parse(responseData);
				              if(responseData.result) location.href = webUrl +  "/view/2017/1212/draw.html?interaction=1&userId=" + userId;
				            });
						});

						//领券
						$(document).on("click",".receive-btn",function(){
							var dataType = $(this).attr("data-type");
							if(userId == ""){//未登录
								bridge.callHandler('goLoginHandler',{'href': backLink}, function(responseData) {
				                  if(typeof responseData=="string")responseData = JSON.parse(responseData);
				                  if(responseData.result) console.log("success");
				                });
							}else{//已登录
								$.ajax({
						            url: webUrl+'/anniversary/lifeStamps.html',
						            type:"get",
						            data:{
						              "userId": userId,
						              "type": dataType
						            },
						            dataType:"jsonp",
						            success:function(data){					              
						              layer.open({
						                className: 'layer-tip',
						                content: data.msg,
						                shade: true,
				            			shadeClose: false,
						                time: 2
						              });

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
							}
						});										
						

		       			//商品详情
		       			$(document).on('click',".buy-btn",function(){
		       				var goodsId = $(this).attr("data-id");

				            bridge.callHandler('goZeroBuyDetailFun',{'id': goodsId,"backLink": backLink }, function(responseData) {
				                if(typeof responseData=="string")responseData = JSON.parse(responseData);
				                if(responseData.result) console.log("success");
				            });
						});
						

					});
					//E-APP交互相关
				},
				outSite: function(){
					var self = this;

					if(self.url.type =='h5'){

						//活动规则
						$(document).on("click","#ruleBtn",function(){
							location.href = webUrl + '/view/2017/1212/rule.html';
						});

						//抽奖
						$(document).on("click","#drawBtn",function(){
							location.href = webUrl + '/view/2017/1212/draw.html?type=h5';
						});

						//领券
						$(document).on("click",".receive-btn",function(){			
							location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.qianbaomu.view';
						});

						//商品详情
						$(document).on('click',".buy-btn",function(){					
							location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.qianbaomu.view';
						});

					}

				},


			};

			var app =new App();

		});
});
