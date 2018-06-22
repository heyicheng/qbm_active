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

				this.init();//初始化页面数据
				this.borrowList();//假日宝标的列表
				this.projectTime();//标详情template自定义函数
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

					//页面数据加载
					$.ajax({
			            url: webUrl +'/holiday/getExchangeList.html',
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
			              		var html = template('mainTpl', data);
								$("#main").html(html);
								if(data.startTime > data.system){
									layer.open({
						                className: 'layer-tip',
						                content: '本期活动暂未开始',
						                shade: false,
						                time: 3000000000
						            });
								}
			              	}else{
				              	layer.open({
					                className: 'layer-tip',
					                content: data.msg,
					                shade: false,
					                time: 3
					            });
			              	}
			            },
			            error:function(){
			              layer.open({
			                className: 'layer-tip',
			                content: "数据请求失败",
			                shade: false,
			                time: 3
			              });
			            }
			        });
		        

			        //奖品领取
					$(document).on("click",".btn",function(){
						var hasActive = $(this).hasClass("active"),
							levelData = $(this).attr("data-level"),
							amountData = $(this).attr("data-amount");
						if(hasActive){
							
							layer.open({
							    content: '确定要领取'+amountData+'红包？',
							    btn: ['立即兑换', '暂不兑换'],
							    success:function(){
							    	$(".layui-m-layerbtn span:eq(1)").attr("data-state",1);
							    },
							    yes: function(index){

							    	var flag = $(".layui-m-layerbtn span:eq(1)").attr("data-state");

							    	if(flag == 1 ){

							    		$(".layui-m-layerbtn span:eq(1)").attr("data-state",0);
							    		var loading = layer.open({
										    type: 2,
										    content: '数据请求中'
										});
							    		$.ajax({
								            url: webUrl +'/holiday/exchange.html',
								            type:"get",
								            data:{
								              "userId": userId,
								              "level": levelData
								            },
								            dataType:"jsonp",
								            success:function(json){
								            	layer.close(loading);
								              	layer.close(index);
								              	if(json.result){							              		
								              		
								              		//领取成功弹窗
								              		layer.open({
								       					type:1,
														className:'receive-result',
														shadeClose:false,
														content: '<div class="layer-top"><img src="/statics/img/pages/2017/jiaribao/layer-top.png" /></div><div class="text-center receive-bd"><div class="result"><h1>恭喜您！</h1><h3>获得<span>'+json.money+'红包</span></h3><div class="result-img"><img src="/statics/img/pages/2017/jiaribao/'+json.giftImage+'-big.png" /></div></div><div class="btn"><img src="/statics/img/pages/2017/jiaribao/btn.png" id="confirmBtn"/></div></div>',
														end: function(){
															self.init();//重新加载数据
														}
													});								       				

								              	}else{
									              	layer.open({
										                className: 'layer-tip',
										                content: json.msg,
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
								                time: 3
								              });
								            }
								        });	

							    	}
							    				        
							    },
							    no:function(){
							    	console.log("cancle");
							    }
							});

							
						}
					});

					//关闭弹窗
	       			$(document).on("click","#confirmBtn",function(){	       				
	       				layer.closeAll();
	       			});

				},
				borrowList:function(){
					var self = this;

					$.ajax({
						type: "get",
						url: webUrl + "/holiday/getHolidayBorrow.html",
						dataType: 'jsonp',
						success: function(data) {
							console.log(data);
							if(data.result){
								if(data.code == 1){
									var html = template('borrow-list-template', data);
									$("#borrowList").html(html);
								}
								if(data.code == 0){
									$(".nonTip").show();
								}
							}
						}
					})
				},

				projectTime:function(){
					var self = this;
					var currentTime = Date.parse(new Date())/1000;
					// 月标/天标
					template.defaults.imports.timeLimitFun1 = function(status,isday,timeLimitDay,timeLimit) {
						if(status == 1){
							if (isday == 1) { //天标
								return timeLimitDay +'<span class="small">'+'天'+'</span>';
							}
							if(isday == 0){//月标
								return timeLimit + '<span class="small">'+'个月'+'</span>';
							}
						}
					};
					//购买标百分比
					template.defaults.imports.scalePercent = function(scales) {
						return (scales*100);
					}
					//购买进度条长度
					template.defaults.imports.scaleWidth = function(scales) {
						return (scales*100).toFixed(0);
					};
					//标是否开始
					template.defaults.imports.startB = function(valid_date) {
						var five = valid_date - 300;
						if(currentTime > five){
							return '';
						}else if(currentTime <= five){
							return '即将发售'
						}
					};
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

						//活动规则
						$(document).on('click',"#rule",function(){
							bridge.callHandler('goPageHandler',{'title': '活动规则','icon':0,'backBtn':0}, function(responseData) {
				              if(typeof responseData=="string")responseData = JSON.parse(responseData);
				              if(responseData.result) location.href = webUrl +  "/view/2017/jiaribao/rule.html?interaction=1&userId=" + userId;
				            });
						});
						

		       			//标的详情
		       			$(document).on('click',".borrowDetail",function(){
							var financingId = $(this).find($('.big1')).attr("data-financingId");//标Id
							var isNewDetail = $(this).find($('.big1')).attr("data-isDetailNew");//新标
							bridge.callHandler('goFinancingDetailFun',{'id': financingId,"isNewDetail": isNewDetail}, function(responseData) {
								if(typeof responseData=="string")responseData = JSON.parse(responseData);
								if(responseData.result) console.log("success");
							});
						});

		       			//跳转至我的券包
		       			$(document).on("click","#ticketPackage",function(){
		       				bridge.callHandler('goAppModule',{'target':'ticketPackage'}, function(responseData) {
				                if(typeof responseData=="string")responseData = JSON.parse(responseData);
				                if(responseData.result) console.log("success");
				            });
		       			});
						

					});
					//E-APP交互相关
				},
				outSite: function(){
					var self = this;
					if(self.url.type != "" || self.url.type != null){
						//活动规则
						$(document).on("click","#rule",function(){
							location.href = webUrl + '/view/2017/jiaribao/rule.html';
						});
					}

					if(self.url.type =='h5'){
						//标的详情
						$(document).on('click',".borrowDetail",function(){
							var financingId = $(this).find($('.big1')).attr("data-financingId");//标Id
							location.href = wapUrl + '/financing/logoDetail.html?borrowId=' + financingId;
						});
						//券包
						$(document).on('click',"#ticketPackage",function(){
							location.href = wapUrl + '/member/redPacket.html';
						});

					}

					if(self.url.type == 'pc'){
						//标的详情
						$(document).on('click',".borrowDetail",function(){
							var financingId = $(this).find($('.big1')).attr("data-financingId");//标Id
							location.href = pcUrl + '/financing-detail.html?id=' + financingId;
						});

						//券包
						$(document).on('click',"#ticketPackage",function(){
							location.href = pcUrl + '/member/reward.html';
						});

					}

				},


			};

			var app =new App();

		});
});
