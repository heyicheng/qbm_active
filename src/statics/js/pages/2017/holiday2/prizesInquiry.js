	define(function(require, exports, module) {

  require('zepto');
  require('fastclick');
  require('swiper');
	require('layer');
	require('layerCss');
  require("artTemplate4");

  FastClick.attach(document.body);

  $(function() {

    var App = function() {

      	this.url = {
        	loginId: getUrlParam('userId'),
        	type: getUrlParam('type'),
			nId: getUrlParam('nId'),
        	from: getUrlParam('from'),
      	};
      	this.init();
      	this.winnerList();
		this.lottery();
		this.getLotteryNumber()
    };

    App.prototype = {
      init: function() {
        var self = this;
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

          //从APP进入重置返回按钮
          if(self.url.from == "app"){
            bridge.callHandler('goLoadPageHandler', {'title':'抽奖区','href':'','icon':3,'backBtn':1}, function(responseData) {
              if (typeof responseData == "string") responseData = JSON.parse(responseData);
              if (responseData.result) console.log("重置参数成功!!");
            });
          }

					/****分享信息****/
          $.ajax({
            type: "get",
            url: webUrl + "/holiday/getHAGiftByDate.html",
            dataType: 'jsonp',
            success: function(data) {
              if(data.result){
                var shareTitle = data.holidatyActivity.shareTitle//分享标题
                var shareIntro = data.holidatyActivity.shareContent//分享标题
                var shareIcon = data.image_server_prefix + data.holidatyActivity.shareIco//分享标题
                /****分享信息****/
                var sendInfo = {
                  'shareTitle': shareTitle,
                  'shareLink': webUrl + '/view/2017/holiday2/activity.html?type=h5&nId=' + activeId,
                  'shareIntro':shareIntro,
                  'shareIcon': shareIcon,
                }

                bridge.callHandler('goSendShareInfoHandler',sendInfo, function(response) {
                  if(typeof response=="string")response = JSON.parse(response);
                  if(response.result) console.log("分享信息发送成功");
                });
              }
            }
          });

          //从H5页面进入重置返回按钮
          if(self.url.from == "h5"){
            bridge.callHandler('goLoadPageHandler', {'title':'抽奖区','href':'','icon':3,'backBtn':0}, function(responseData) {
              if (typeof responseData == "string") responseData = JSON.parse(responseData);
              if (responseData.result) console.log("重置参数成功!!");
            });

            //返回主要抽奖区
            bridge.registerHandler('goBackBtnHandler', function(data, responseCallback){
              var backLink = webUrl + "/view/2017/holiday2/activity.html?userId="+self.url.loginId+"&nId="+self.url.nId;
              responseData = {'title': "全民大转盘",'href':'','icon':0,'backBtn':0};
              responseCallback(responseData);
              if(typeof data=="string")data = JSON.parse(data);
              if(data.result) location.href = backLink;
            });
          }

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
      //奖品列表
      winnerList: function() {
        var self = this;
        $.ajax({
          type: "get",
          url: webUrl + "/holiday/winnerListByUser.html",
          data: {
            userId: self.url.loginId,
          },
          dataType: "jsonp",
          success: function(data) {
            if (typeof responseData == "string") {
              data = JSON.parse(data);
            }
            console.log(data);
            if (data.result) {
              var html = template('winner-list-template', data);
              $("#winner-list").html(html);
              var mySwiper = new Swiper('.swiper-container',{
								autoplayDisableOnInteraction : false,
                initialSlide: 0, //默认显示第几页
                slidesPerView: 5, //默认一屏幕显示的页数
                direction: 'vertical',
              })
            }
          },
          error:function(data){
            //alert('请求失败')
          }
        });
      },
			lottery:function(){
				//点击礼盒切换奖品
				$(document).on('click','.gift-silver img',function(){
					$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-open.png').removeClass('imgWidth2').addClass('imgWidth1');
					$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-close.png').removeClass('imgWidth1').addClass('imgWidth2');
					$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-close.png').removeClass('imgWidth1').addClass('imgWidth2');
					$('.gift-lists1').removeClass('hide').siblings('div').addClass('hide');
					$('.holiday-bi').html('1个假日币');
					$('.arrow1').css({'margin-left':'.68rem'});
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
					$('.arrow1').css({'margin-left':'5.35rem'});
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
				//活动倒计时
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
								if(nowTime > endTime){
									$('.noStart').show();
									$('.gift').hide();
								}else{
									$('.noStart').hide();
									$('.gift').show();
								}
							}
						},
						error:function (data) {
							console.log('请求失败');
						}
				});
			},
			//抽奖次数
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
						if (typeof responseData == "string") {
							data = JSON.parse(data);
						}
						if(data.result){
							if(data.counts > 0){
								if(data.counts>0  && data.counts<5){									
									$('.gift-text1').addClass('btn-start');
									$('.gift-text2').addClass('btn-start-disabled');
									$('.gift-text3').addClass('btn-start-disabled');
								}else if (data.counts>=5 && data.counts<10) {
									$('.gift-text1').addClass('btn-start-disabled');
									$('.gift-text2').addClass('btn-start');
									$('.gift-text3').addClass('btn-start-disabled');
								}else if (data.counts>=10) {
									$('.gift-text1').addClass('btn-start-disabled');
									$('.gift-text2').addClass('btn-start-disabled');
									$('.gift-text3').addClass('btn-start');
								}
							}else{
								$('.gift-text').addClass('btn-start-disabled');
							}
						}
					}
				});
			},

    };

    const app = new App();

  });
});
