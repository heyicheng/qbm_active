define(function(require,exports,module){

		require('zepto');
		require('fastclick');
		require('layer');
		require('layerCss');
		require('swiper');
		require("artTemplate4");
		require("artTemplateHelper");

		FastClick.attach(document.body);

		$(function() {
			//参数处理,获取用户id
			function getUrlParam(name){
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if(r!=null)return unescape(r[2]); return null;
			}

			var App = function(){

				this.url = {
					type: getUrlParam('type'),
					loginId: getUrlParam('userId'),
					from: getUrlParam('from')
				};
				this.init();
				this.listPro();//标列表
				this.projectTime();//标详情template自定义函数
				this.sharemove();//侧边栏分享
				this.lottery()//领取奖励
				this.getLotteryNumber();//获取抽奖次数
				this.winnerList();//获奖名单
				this.shareLink();//从分享进入主页函数
				this.startActive();//活动倒计时
			};

			App.prototype={

				init:function(){
					console.log("webUrl="+webUrl);

					var self = this;
					var responseData = {};

					var swiper = new Swiper('.swiper-container', {
				        pagination: '.swiper-pagination',
				        paginationClickable: true,
				        loop: true,
				        autoplay: 2500,
        				autoplayDisableOnInteraction: false
				    });


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
						if(self.url.from == 'intro'){
							bridge.registerHandler('goBackBtnHandler', function(data, responseCallback){
								var backLink = webUrl + "/activity/holiday/intro.html?from=intro&userId="+self.url.loginId;
								responseData = {'title': "钱保姆",'href':backLink,'icon':0,'backBtn':1};
								responseCallback(responseData);
								if(typeof data=="string")data = JSON.parse(data);
								if(data.result) location.href = backLink;
							});

							bridge.callHandler('goLoadPageHandler', {'title': '','href': '','icon': 2,'backBtn': 0}, function(responseData) {
								if (typeof responseData == "string") responseData = JSON.parse(responseData);
								if (responseData.result) console.log("重置参数成功!!");
							});

						}else if(self.url.from == 'pcIndex'){

							bridge.registerHandler('goBackBtnHandler', function(data, responseCallback){
								var backLink = webUrl + "/activity/holiday/intro.html?from=pcIndex&userId="+self.url.loginId;
								responseData = {'title': "钱保姆",'href':backLink,'icon':0,'backBtn':1};
								responseCallback(responseData);
								if(typeof data=="string")data = JSON.parse(data);
								if(data.result) location.href = backLink;
							});

							bridge.callHandler('goLoadPageHandler', {'title': '','href': '','icon': 2,'backBtn': 0}, function(responseData) {
								if (typeof responseData == "string") responseData = JSON.parse(responseData);
								if (responseData.result) console.log("重置参数成功!!");
							});
						}
						else{
							bridge.callHandler('goLoadPageHandler', {'title': '','href': '','icon': 2,'backBtn': 1}, function(responseData) {
								if (typeof responseData == "string") responseData = JSON.parse(responseData);
								if (responseData.result) console.log("重置参数成功!!");
							});
						}
						//未登录
						if(self.url.loginId == '' || self.url.loginId == null){
							$('.counts').html('0');
						}

						/****奖品列表****/
						$.ajax({
							type: "get",
							url: webUrl + "/holiday/getHAGiftByDate.html",
							dataType: 'jsonp',
								success: function(data) {
									if(data.result){
										//发送分享信息给APP
										var activeId = data.holidatyActivity.nid;//活动id
										var status = data.code;//活动状态0:预期活动.1:进行中活动,2:往期回顾------------李贺默认传1
										var shareTitle = data.holidatyActivity.shareTitle//分享标题
										var shareIntro = data.holidatyActivity.shareContent//分享标题
										var shareIcon = data.image_server_prefix + data.holidatyActivity.shareIco//分享标题
										$('#nid').val(activeId);
										/****分享信息****/
										var sendInfo = {
											'shareTitle': shareTitle,
											'shareLink': webUrl + '/view/2017/holiday2/activity.html?type=h5&nId=' + activeId,
											'shareIntro':shareIntro,
											'shareIcon': shareIcon,
											'status':status,//活动状态，1正在进行的活动
											'activeId':activeId,//活动id，判断当前活动是否可以分享
										}

										bridge.callHandler('goSendShareInfoHandler',sendInfo, function(response) {
											if(typeof response=="string")response = JSON.parse(response);
											if(response.result) console.log("分享信息发送成功");
										});

										/****侧边分享按钮****/
										$(document).on("click","#side-share", function() {
											bridge.callHandler('goSharePopHandler',{'status': 1}, function(responseData) {
												if (typeof responseData == "string") responseData = JSON.parse(responseData);
												if (responseData.result) console.log("success");
											});
										});

										/****查看活动规则****/
										if(self.url.from == 'intro'){
											$(document).on('click',".ruleBtn",function(){
												bridge.callHandler('goPageHandler',{'title':'活动规则','icon':0,'backBtn':0},function(responseData){
													if(typeof responseData=="string")responseData = JSON.parse(responseData);
													if(responseData.result) location.href = webUrl + "/view/2017/holiday2/rule.html?userId="+self.url.loginId+"&nId="+activeId+"&from=intro";
												});
											});
										}else if(self.url.from == 'pcIndex'){
											$(document).on('click',".ruleBtn",function(){
												bridge.callHandler('goPageHandler',{'title':'活动规则','icon':0,'backBtn':0},function(responseData){
													if(typeof responseData=="string")responseData = JSON.parse(responseData);
													if(responseData.result) location.href = webUrl + "/view/2017/holiday2/rule.html?userId="+self.url.loginId+"&nId="+activeId+"&from=pcIndex";
												});
											});
										}else{
											$(document).on('click',".ruleBtn",function(){
												bridge.callHandler('goPageHandler',{'title':'活动规则','icon':0,'backBtn':0},function(responseData){
													if(typeof responseData=="string")responseData = JSON.parse(responseData);
													if(responseData.result) location.href = webUrl +  "/view/2017/holiday2/rule.html?userId="+self.url.loginId + "&nId="+activeId;
												});
											});
										}
									}else{
									}
								},
								error:function (data) {
									console.log('请求失败');
								}
							});
						/****活动回顾****/
						$(document).on('click',".review-forum",function(){
							//goLink需要加from=appBanner,type=1,interaction=1
							var backLink = webUrl + '/view/2017/holiday2/activity.html?interaction=1'
							bridge.callHandler('goBbsArticleHandler',{'title':'假日宝活动回顾','goLink':'http://bbs.qbm360.com/app/article.html?id=4457&type=1&from=appBanner&interaction=1','href':backLink+'&type=h5','backBtn':0},function(responseData) {
								if(typeof responseData=="string")responseData = JSON.parse(responseData);
								if(responseData.result) console.log("success");
							});
						});
						/****晒中奖攻略****/
						$(document).on('click',".guild-forum",function(){
							//goLink需要加from=appBanner,type=1,interaction=1
							var backLink = webUrl + '/view/2017/holiday2/activity.html?interaction=1'
							bridge.callHandler('goBbsArticleHandler',{'title':'晒中奖攻略','goLink':'https://bbs.qbm360.com/app/article.html?id=4521&type=1&from=appBanner&interaction=1','href':backLink+'&type=h5','backBtn':0},function(responseData) {
								if(typeof responseData=="string")responseData = JSON.parse(responseData);
								if(responseData.result) console.log("success");
							});
						});

						/****跳转标购买页****/
						$(document).on('click',".borrowDetail",function(){
							var financingId = $(this).find($('.big1')).attr("data-financingId");//标Id
							var isNewDetail = $(this).find($('.big1')).attr("data-isDetailNew");//新标
							bridge.callHandler('goFinancingDetailFun',{'id': financingId,"isNewDetail": isNewDetail}, function(responseData) {
								if(typeof responseData=="string")responseData = JSON.parse(responseData);
								if(responseData.result) console.log("success");
							});
						});

						/****抽奖****/
						$(document).on('click','.gift-text',function(){
							var giftType = $(this).attr('type');
								if(giftType == 0){
									var span = '确定领取白银礼盒吗？',
									giftTypeLink = '0',
									src1 = '/statics/img/pages/2017/holiday2/red2.png',
									src2 = '/statics/img/pages/2017/holiday2/red5.png',
									src3 = '/statics/img/pages/2017/holiday2/lxx.png',
									red1 = '2元红包',
									red2 = '5元红包',
									red3 = '小米旅行箱';
									$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-open.png').removeClass('imgWidth2').addClass('imgWidth1');
									$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-close.png').removeClass('imgWidth1').addClass('imgWidth2');
									$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-close.png').removeClass('imgWidth1').addClass('imgWidth2');
									$('.gift-lists1').removeClass('hide').siblings('div').addClass('hide');
									$('.holiday-bi').html('1个假日币');
									$('.arrow1').css({'margin-left':'.45rem'});
								}else if(giftType == 1){
									var span = '确定领取钻石礼盒吗？',
									giftTypeLink = '1',
									src1 = '/statics/img/pages/2017/holiday2/red30.png',
									src2 = '/statics/img/pages/2017/holiday2/red50.png',
									src3 = '/statics/img/pages/2017/holiday2/iphone.png',
									red1 = '30元红包',
									red2 = '50元红包',
									red3 = 'iPhone8';
									$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-close.png').removeClass('imgWidth1').addClass('imgWidth2');
									$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-close.png').removeClass('imgWidth1').addClass('imgWidth2');
									$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-open.png').removeClass('imgWidth2').addClass('imgWidth1');
									$('.gift-lists3').removeClass('hide').siblings('div').addClass('hide');
									$('.holiday-bi').html('10个假日币');
									$('.arrow1').css({'margin-left':'5.5rem'});
								}else if(giftType == 2){
									var span = '确定领取黄金礼盒吗？',
									giftTypeLink = '2',
									src1 = '/statics/img/pages/2017/holiday2/red10.png',
									src2 = '/statics/img/pages/2017/holiday2/red20.png',
									src3 = '/statics/img/pages/2017/holiday2/phc.png',
									red1 = '10元红包',
									red2 = '20元红包',
									red3 = '小米平衡车';
									$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-close.png').removeClass('imgWidth1').addClass('imgWidth2');
									$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-open.png').removeClass('imgWidth2').addClass('imgWidth1');
									$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-close.png').removeClass('imgWidth1').addClass('imgWidth2');
									$('.gift-lists2').removeClass('hide').siblings('div').addClass('hide');
									$('.holiday-bi').html('5个假日币');
									$('.arrow1').css({'margin-left':'3rem'});
								}
								layer.open({
									className:'get-gift',
									shadeClose:false,
									content: '<div class="close pos-abs"><div class="close-btn"></div></div><p class="conYou" giftTypeLink='+giftTypeLink+'>'+span+'</p><p class="spanP">领取后随机获得礼盒中的一件奖品</p><div class="img-list"><dl class="img-item"><dt><img class="img1" src='+src1+'></dt><dd>'+red1+'</dd></dl><dl class="img-item"><dt><img class="img1" src='+src2+'></dt><dd>'+red2+'</dd></dl><dl class="img-item"><dt><img class="img1" src='+src3+'></dt><dd>'+red3+'</dd></dl></div><div id="address">确认领取</div>'
								});
								$(document).on('click','.close',function(){
									layer.closeAll();
								});
						})
						//点击抽奖
						$(document).on('click','#address',function(){
							var giftType = $('.conYou').attr('giftTypeLink');
							layer.closeAll();
							$.ajax({
								type: "get",
								url: webUrl + "/holiday/lottery.html",
								data: {
									'userId': self.url.loginId,
									'giftType':giftType
								},
								dataType: "jsonp",
								success: function(data) {
									if (typeof responseData == "string") {
										data = JSON.parse(data);
									}
									console.log(data);
									if (data.result) {
										self.getLotteryNumber();//成功之后回调抽奖次数
										var info = {
											'src': data.image_server_prefix+data.gift.giftImage,
											'titleText': data.gift.name,
											'type': 1
										}
										bridge.callHandler('goBombBoxHandler',info,function(responseData){
											if (typeof responseData == "string") responseData = JSON.parse(responseData);
											if (responseData.result) console.log("success");
										});
									}else{
										//alert("抽奖msg="+data.msg)
									}
								},
								error:function(data){
									alert(data.msg)
								}
							});
						});
					});
					//E-APP交互相关
				},

				//查看奖品
				lottery:function(){
					var self = this;
					//点击礼盒切换奖品
					$(document).on('click','.gift-silver img',function(){
						$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-open.png').removeClass('imgWidth2').addClass('imgWidth1');
						$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-lists1').removeClass('hide').siblings('div').addClass('hide');
						$('.holiday-bi').html('1个假日币');
						$('.arrow1').css({'margin-left':'.45rem'});
					})
					$(document).on('click','.gift-gold img',function(){
						$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-open.png').removeClass('imgWidth2').addClass('imgWidth1');
						$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-lists2').removeClass('hide').siblings('div').addClass('hide');
						$('.holiday-bi').html('5个假日币');
						$('.arrow1').css({'margin-left':'3rem'});
					})
					$(document).on('click','.gift-Diamonds img',function(){
						$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-open.png').removeClass('imgWidth2').addClass('imgWidth1');
						$('.gift-lists3').removeClass('hide').siblings('div').addClass('hide');
						$('.holiday-bi').html('10个假日币');
						$('.arrow1').css({'margin-left':'5.5rem'});
					})
					//点击查看奖品切换奖品
					$(document).on('click','.gift-text1',function(){
						$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-open.png').removeClass('imgWidth2').addClass('imgWidth1');
						$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-lists1').removeClass('hide').siblings('div').addClass('hide');
						$('.holiday-bi').html('1个假日币');
						$('.arrow1').css({'margin-left':'.45rem'});
					})
					$(document).on('click','.gift-text2',function(){
						$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-open.png').removeClass('imgWidth2').addClass('imgWidth1');
						$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-lists2').removeClass('hide').siblings('div').addClass('hide');
						$('.holiday-bi').html('5个假日币');
						$('.arrow1').css({'margin-left':'3rem'});
					})
					$(document).on('click','.gift-text3',function(){
						$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-close.png').removeClass('imgWidth1').addClass('imgWidth2');
						$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-open.png').removeClass('imgWidth2').addClass('imgWidth1');
						$('.gift-lists3').removeClass('hide').siblings('div').addClass('hide');
						$('.holiday-bi').html('10个假日币');
						$('.arrow1').css({'margin-left':'5.5rem'});
					})

				},
				getLotteryNumber:function(){
					var self = this;
					$.ajax({
						type: "get",
						url: webUrl + "/holiday/getLotteryNumber.html",
						data: {
							userId: self.url.loginId,
						},
						dataType: "jsonp",
						success: function(data) {
							console.log(data);
							if (typeof responseData == "string") {
								data = JSON.parse(data);
							}
							if(data.result){
								$('.counts').html(data.counts);
								if(data.counts > 0){
									if(data.counts>0  && data.counts<5){
										$('.gift-text2').addClass('btn-start-disabled');
										$('.gift-text3').addClass('btn-start-disabled');
									}else if (data.counts>=5 && data.counts<10) {
										$('.gift-text3').addClass('btn-start-disabled');
									}else if (data.counts>=10) {
									}
								}else{
									$('.gift-text').addClass('btn-start-disabled');
								}
							}
						}
					});
				},
				//获奖列表
				winnerList: function() {
					var self = this;
					$.ajax({
						type: "get",
						url: webUrl + "/holiday/getWinnerList.html",
						dataType: "jsonp",
						success: function(data) {
							if (typeof responseData == "string") {
								data = JSON.parse(data);
							}
							console.log(data);
							// if (data.result) {
								if(data.dataList.length>0){
									var html1 = template('borrow-list1-template', data);
									$(".laba").html(html1)
									$('.laba').liMarquee({
										scrollamount: 40,
										hoverstop: false
									});
								}else{
									// alert('中奖名单长度小于1')
								}
							// }else{

							// }

						},
						error:function(data){
							console.log('请求失败')
						}
					});
				},
				//活动倒计时
				startActive:function(){
					var self = this;
					$.ajax({
						type: "get",
						url: webUrl + "/holiday/getHAGiftByDate.html",
						dataType: 'jsonp',
							success: function(data) {
								console.log(data);
								if(data.result){
									//抢购时间
									var startTime = data.startTime;
									var endTime = data.endTime;
									var nowTime = data.systime;
									$("#startTime").val(startTime);
									$("#endTime").val(endTime);
									var startTime = $('#startTime').val();
									var endTime = $('#endTime').val();
									var timer = startTime - nowTime;
									var timer1 = endTime - nowTime;
									if(timer > 0 ){//活动未开始
										$('.tip2').hide();//前往我的-奖品区隐藏
										$('.forum').show();//显示论坛
										$(".gift-wrap").css({'padding-top':'1.36rem'});
										var timeCountdown = setInterval(function(){
											if(timer > 1){
												timer = timer - 1;
												var day = Math.floor((timer / 3600) / 24);
												var hour = Math.floor((timer / 3600) % 24);
												var minute = Math.floor((timer / 60) % 60);
												var second = Math.floor(timer % 60);
												var showDay = day;
												var showHour = hour < 10 ? "0" + hour : hour;
												var showMinute = minute < 10 ? "0" + minute : minute;
												var showSecond = second < 10 ? "0" + second : second;
												if(showDay>0){
													$('.timeout').html('本期活动：<em>'+showDay+'天'+showHour+':'+showMinute+':'+showSecond+'</em>后开启');
												}else{
													$('.timeout').html('本期活动：<em>'+showHour+':'+showMinute+':'+showSecond+'</em>后开启');
												}
											}
										},1000);
									}else if(timer1>0){//活动已开始
										console.log("活动已开始");
										$('.forum').addClass('hide');
										$('.banner-marquee').removeClass('hide');
										$(".gift-wrap").css({'padding-top':'.3rem'});
										$('.gift-text').html('领取奖品').addClass('btn-start').removeClass('btn-yugao');
										var timeCountdown1 = setInterval(function(){
											if(timer1 > 1){
												timer1 = timer1 - 1;
												var day1 = Math.floor((timer1 / 3600) / 24);
												var hour1 = Math.floor((timer1 / 3600) % 24);
												var minute1 = Math.floor((timer1 / 60) % 60);
												var second1 = Math.floor(timer1 % 60);
												var showDay1 = day1;
												var showHour1 = hour1 < 10 ? "0" + hour1 : hour1;
												var showMinute1 = minute1 < 10 ? "0" + minute1 : minute1;
												var showSecond1 = second1 < 10 ? "0" + second1 : second1;
												if(showDay1>0){
													$('.timeout').html('本期活动：<em>'+showDay1+'天'+showHour1+':'+showMinute1+':'+showSecond1+'</em>后结束');
												}else{
													$('.timeout').html('本期活动：<em>'+showHour1+':'+showMinute1+':'+showSecond1+'</em>后结束');
												}
										 }
										},1000);
									}else if(timer1<0){
										console.log("本期活动已结束");
										$(".gift-wrap").css({'padding-top':'1.36rem'});
										$('.timeout').html('本期活动已结束');
										clearInterval(timeCountdown);
										clearInterval(timeCountdown1);
										$('.forum').show();
										$('.counts').html('0');
										$('#side-share').hide();
										$('.tip2').hide();
										$('.gift-text').html('查看奖品').addClass('btn-start').removeClass('btn-yugao');
									}
								}else{
									$('.timeout').html('本期活动已结束');
									$(".gift-wrap").css({'padding-top':'1.36rem'});
									$('.counts').html('0');
									$('#side-share').hide();
									$('.tip2').hide();
									$('.gift-text').html('查看奖品').removeClass('btn-start').addClass('btn-yugao');
								}
							},
							error:function (data) {
								console.log('请求失败');
							}
					});
				},

				/****分享链接****/
				shareLink:function(){
					var self = this;
					if(self.url.type == "h5" || self.url.type == "pc"){
						$('.counts').html('0');//次数为0
						$('#side-share').hide()//隐藏侧边栏
						//活动倒计时
						$.ajax({
							type: "get",
							url: webUrl + "/holiday/getHAGiftByDate.html",
							dataType: 'jsonp',
								success: function(data) {
									console.log(data);
									if(data.result){
										var activeId = data.holidatyActivity.nid;
										//抢购时间
										var startTime = data.startTime;
										var endTime = data.endTime;
										$("#startTime").val(startTime);
										$("#endTime").val(endTime);
										self.startActive();//活动倒计时
										$(document).on('click',".ruleBtn",function(){
											location.href = webUrl + "/view/2017/holiday2/rule.html?nId="+activeId;
										});
									}
								},
								error:function (data) {
									console.log('请求失败');
								}
						});
					};
					//分享页进去
					if(self.url.type == "h5"){
						//如果从分享进入主页，点击转盘会跳到下载页
						$(document).on('click','.turntableBtn',function(){
							location.href = webUrl + "/applink.html";
						});
						//点击活动标跳到下载页
						$(".borrowList").click(function(){
							location.href = webUrl + "/applink.html";
						});
					}
					//pc页进去
					if(self.url.type == "pc"){
						//点击活动标跳到下载页
						$(document).on('click','.borrowDetail',function(){
							var financingId = $(this).find($('.big1')).attr("data-financingId");//标Id
							location.href =webUrl+"/financing-detail.html?id="+financingId;
						});
					}
				},

				//理财列表
				listPro:function () {
					var self = this;
					$.ajax({
						type: "get",
						url: webUrl + "/holiday/getHolidayBorrow.html",
						dataType: 'jsonp',
						success: function(data) {
							//alert('success')
							if(data.result){
								if(data.code == 1){
									var html = template('borrow-list2-template', data);
									$("#borrowList").html(html);
								}
								if(data.code == 0){
									$(".nonTip").show();
								}
							}
						}
					})
				},
				//自定义函数
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
				//侧边分享移动
				sharemove: function() {
					// 获取节点
					var block = document.getElementById("side-share");
					var oW = null;
					var oH = null;
					// 绑定touchstart事件
					block.addEventListener("touchstart", function(e) {
						var touches = e.touches[0];
						oW = touches.pageX - block.offsetLeft;
						oH = touches.pageY - block.offsetTop;

						//阻止页面的滑动默认事件
						document.addEventListener("touchmove", defaultEvent, false);
					}, false)

					block.addEventListener("touchmove", function(e) {
						var touches = e.touches[0];
						var x = touches.pageX - oW;
						var y = touches.pageY - oH;

						var touches = e.touches[0];
						var x = touches.pageX - oW;
						var y = touches.pageY - oH;
						block.style.left = x / 50 + "rem";
						block.style.top = y / 50 + "rem";


					}, false);

					block.addEventListener("touchend", function(e) {
						// var touches = e.touches[0];
						var x = e.changedTouches[0].pageX;
						var y = e.changedTouches[0].pageY;
						if (x > ($(window).width()) / 2) {
							block.style.left = $(window).width() - $('.side-share').width() + 'px';
						}
						if (x < ($(window).width()) / 2) {
							block.style.left = 0;
						}
						if(y < $('.side-share').height()){
							block.style.top = 1+"px";
						}
						if(y >= $(window).height() - $('.side-share').height()){
							block.style.top = $(window).height() - $('.side-share').height() + "px";
						}


						document.removeEventListener("touchmove", defaultEvent, false);
					}, false);

					function defaultEvent(e) {
						e.preventDefault();
					}
				},

			};

			var app =new App();

		});
});
