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

          var normalSelected = $(".nav").attr('data-type');

          self.getGuessRecord(normalSelected,userId);

					//页面初始化数据
          $(document).on('click',".nav",function(){
            $(this).addClass("selected").siblings().removeClass("selected");
            var dataType = $(this).attr('data-type');

            self.getGuessRecord(dataType,userId);

          });


				},
        getGuessRecord: function(typeVal,userIdVal) {
          var self = this;
          console.log(typeVal,userIdVal);

					//竞猜结果处理
          template.defaults.imports.guessingRecordFun = function(status,points,result) {
						if(status == 0){//0 待开奖
							return '<dl class="fn-fl item2"><dt>投<em>5</em>枚</dt><dd>押<em>【'+result+'】</em></dd></dl><dl class="fn-fr item3"><dt>待开奖</dt></dl>';
						}else if(status == 1){//1 中奖
							return '<dl class="fn-fl item2"><dt>投<em>5</em>枚</dt><dd>押<em>【'+result+'】</em></dd></dl><dl class="fn-fr item3"><dt>中奖</dt><dd><em>+'+points+'</em>枚</dd></dl>';
						}else if(status == 2){//2 未中奖
							return '<dl class="fn-fl item2"><dt>投<em>5</em>枚</dt><dd>押<em>【'+result+'】</em></dd></dl><dl class="fn-fr item3"><dt>未中奖</dt></dl>';
						}

					}

          $.ajax({
              url: webUrl +'/worldcup/getGuessList.html',
							//url: 'http://192.168.188.187:8080/worldcup/getGuessList.html',
              type:"get",
              data:{
                "userId": userIdVal,
                "type": typeVal
              },
              dataType:"jsonp",
              success:function(res){
                if(typeof res == "string"){
                  res = $.parseJSON(res);
                }
                console.log(res);

                if(res.result){
                  var dataLength = res.dataList.length;
                  if(dataLength != 0){
                    $(".nodata").addClass('hide');
                    //数据渲染
                    var html = template('dataListTpl', res);
                    $("#dataList").html(html);
                  }else{
                    $("#dataList").html('<p class="text-center nodata">暂无记录哦！</p>');
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
                  time: 3
                });
              }
          });

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
