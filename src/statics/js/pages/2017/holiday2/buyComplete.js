define(function(require, exports, module) {

  require('zepto');
  require('fastclick');
  require('layer');
  require('layerCss');

  FastClick.attach(document.body);

   $(function() {
    //参数处理,获取用户id
    function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }

    var App = function() {

      this.url = {
        loginId: getUrlParam('userId'),
        type: getUrlParam('type'),
      };
      this.init();
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

          //重置
          bridge.callHandler('goLoadPageHandler', {'title':'购买成功','href':'','icon':0,'backBtn':1}, function(responseData) {
            if (typeof responseData == "string") responseData = JSON.parse(responseData);
            if (responseData.result) console.log("重置参数成功!!");
          });

          /****分享信息****/
          $.ajax({
            type: "get",
            url: webUrl + "/holiday/getHAGiftByDate.html",
            dataType: 'jsonp',
            success: function(data) {
              if(data.result){
                var shareTitle = data.holidatyActivity.shareTitle//分享标题
                var shareIntro = data.holidatyActivity.shareContent//分享标题
                var shareIcon = data.image_server_prefix + data.holidatyActivity.shareIco//分享标题 +data.holidatyActivity.shareIco//分享标题
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

          //获得标信息
          bridge.registerHandler('goGetInfoHandler',function(responseData) {
            if(typeof responseData=="string")responseData = JSON.parse(responseData);
            if(responseData.result){
              $(".biaotitle").html(responseData.msg);
              $(".redBag").html(responseData.hbMoney);
              $(".money").html(responseData.account);
              $(".profit").html(responseData.interest);
            }
          });

          /****查看账户****/
          $(".goUserCenter").on("click",function(){
            bridge.callHandler('goMyCenterHandler',function(responseData) {
              if(typeof responseData=="string")responseData = JSON.parse(responseData);
              if(responseData.result) console.log("success");
            });
          });

          /****返回假日宝首页****/
          $(".backBtn").on("click",function(){
            var href =  webUrl+ "/view/2017/jiaribao/index.html?interaction=1&userId="+self.url.loginId;
            bridge.callHandler('goHolidayIndexHandler',{'href':href},function(responseData){
              if (typeof responseData == "string") responseData = JSON.parse(responseData);
              if (responseData.result) console.log("success");
            });
          });

          $(document).on('click','.gift-text',function(){
            var giftType = $(this).attr('type');
            //$(this).addClass('btn-disabled2')
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
      //-------点击抽奖
      lottery:function(){
        var self = this;
        //点击礼盒切换奖品
      	$(document).on('click','.gift-silver img',function(){
      		$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-open.png').removeClass('imgWidth2').addClass('imgWidth1');
      		$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-close.png').removeClass('imgWidth1').addClass('imgWidth2');
      		$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-close.png').removeClass('imgWidth1').addClass('imgWidth2');
      		$('.gift-lists1').removeClass('hide').siblings('div').addClass('hide');
      		$('.holiday-bi').html('1个假日币');
      		$('.arrow1').css({'margin-left':'.65rem'});
      	})
      	$(document).on('click','.gift-gold img',function(){
      		$('.gift-silver img').attr('src','/statics/img/pages/2017/holiday2/silver-close.png').removeClass('imgWidth1').addClass('imgWidth2');
      		$('.gift-gold img').attr('src','/statics/img/pages/2017/holiday2/gold-open.png').removeClass('imgWidth2').addClass('imgWidth1');
      		$('.gift-Diamonds img').attr('src','/statics/img/pages/2017/holiday2/diamonds-close.png').removeClass('imgWidth1').addClass('imgWidth2');
      		$('.gift-lists2').removeClass('hide').siblings('div').addClass('hide');
      		$('.holiday-bi').html('5个假日币');
      		$('.arrow1').css({'margin-left':'2.98rem'});
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

    };
   const app = new App();

  });
});
