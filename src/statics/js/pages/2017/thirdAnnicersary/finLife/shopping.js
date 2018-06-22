'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
	require('jquery');
	var layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);

	var text = ["双11“周年庆”14：00生活券即将开抢，你的小手准备好了么！", "双11“周年庆”明日11：00生活券即将开抢，你的小手准备好了么！", "双11“周年庆”11：00生活券已抢光，14：00更多礼券等你抢！", "双11“周年庆”16：00生活券已抢光，明日11：00更多礼券等你抢！"];

	var FinLife = function () {
		function FinLife() {
			_classCallCheck(this, FinLife);

			this.init = this.init.bind(this);
			this.listen = this.listen.bind(this);
			this.init();
			this.listen();
		}

		_createClass(FinLife, [{
			key: 'init',
			value: function init() {
				this.userId = getUrlParam('userId');
				this.type = getUrlParam('type');
				this.derive = getUrlParam('derive');
				//初始化商品框长度
				var bHeight = $('body').height();
				var topHeight = $(".top").height();
				var tabHeight = $(".tab").height();

				$('.goodsBox').height(bHeight - topHeight - tabHeight + 20);

				this.setTop();
				if (!this.type) {
					this.app();
				}
			}
		}, {
			key: 'setTop',
			value: function setTop() {
				$.ajax({
					url: pcUrl + '/hb/getCurrentTimeStamp.html',
					type: 'get',
					dataType: 'jsonp',
					data: {}
				}).done(function (data) {
					console.log("success");
					var d = new Date(data.currentTime * 1000);
					var month = d.getMonth() + 1;
					var day = d.getDate();
					console.log(d.getMonth());
					if (month < 11 || day < 10) {
						layer.open({
							content: "此专区11.10正式开启",
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					} else if (month >= 11 && day > 12) {
						layer.open({
							content: '活动已结束哦！',
							style: 'background-color: rgba(0,0,0,0.5); color:#fff;font-size: .3rem;',
							time: 3
						});
					} else {
						$('.top img').attr('src', '/statics/img/pages/2017/thirdAnnicersary/finLife/shopTop2.png');
					}
				}).fail(function (data) {
					console.log("error");
					layer.open({
						content: data.msg,
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				});
			}
		}, {
			key: 'app',
			value: function app() {
				var self = this;
				//S-APP交互相关
				function connectWebViewJavascriptBridge(callback) {
					//判断APP是否支持WebViewJavascriptBridge
					if (window.WebViewJavascriptBridge) {
						callback(WebViewJavascriptBridge);
					} else {
						document.addEventListener('WebViewJavascriptBridgeReady', function () {
							callback(WebViewJavascriptBridge);
						}, false);
					}
				}
				connectWebViewJavascriptBridge(function (bridge) {

					//加载页面后调用
					bridge.init(function (message, responseCallback) {
						var data = { 'Javascript Responds': 'Wee!' };
						responseCallback(data);
					});

					bridge.callHandler('goLoadPageHandler', { 'title': '限时狂欢，够畅快', 'href': '', 'icon': 2, 'backBtn': 0 }, function (responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) console.log("BANNER进入加载成功");
					});
					//发送分享信息给APP
					var sendInfo = {
						'shareTitle': '【三周年庆典】理财生活圈限时狂欢',
						'shareLink': webUrl + '/view/2017/thirdAnnicersary/finLife/shopping.html?type=h5',
						'shareIntro': '品牌尖货限时低价抢购！',
						'shareIcon': pcCdnUrl + '/images/shareIcon/znq.png'
					};

					bridge.callHandler('goSendShareInfoHandler', sendInfo, function (response) {
						if (typeof response == "string") response = JSON.parse(response);
						if (response.result) console.log("分享信息发送成功");
					});
					//返回
					bridge.registerHandler('goBackBtnHandler', function (data, responseCallback) {
						// let finLife = (self.derive == 'finLife')?'finLife/' : '';
						// let backLink = webUrl + "/view/2017/thirdAnnicersary/"+ finLife +"index.html?interaction=1&userId=" + getUrlParam('userId');
						var backLink = webUrl + "/view/2017/thirdAnnicersary/index.html?interaction=1&userId=" + getUrlParam('userId');
						var responseData = { 'title': "三周年庆典", 'href': backLink, 'icon': 1, 'backBtn': 1 };
						// if(self.derive == 'finLife'){
						// 	responseData = { 'title': "惊喜三重奏，生活“购”畅快", 'href': backLink, 'icon': 2, 'backBtn': 1 };
						// }
						responseCallback(responseData);
						if (typeof data == "string") data = JSON.parse(data);
						if (data.result) location.href = backLink;
					});

					//跳转至"零0购商品详情"
					$(document).on('click', '.goods', function (event) {
						var goodsId = $(this).data('gid');
						bridge.callHandler('goZeroBuyDetailFun', { 'id': goodsId, 'backLink': location.href + '&interaction=1' }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
					});

					$(document).on('click', '#rules', function () {
						bridge.callHandler('goPageHandler', { 'title': '活动规则', 'icon': 0, 'backBtn': 0 }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) location.href = webUrl + '/view/2017/thirdAnnicersary/finLife/shoppingRules.html?interaction=1&derive=' + self.derive + '&userId=' + self.userId;
						});
					});
				});
				//E-APP交互相关
			}
		}, {
			key: 'listen',
			value: function listen() {
				var self = this;
				if (self.type == "h5") {
					$(document).on("click", ".goods", function () {
						location.href = "https://www.qbm360.com/applink.html";
					});
					$(document).on('click', '#rules', function () {
						location.href = webUrl + '/view/2017/thirdAnnicersary/finLife/shoppingRules.html?interaction=1&userId=' + self.userId;
					});
				}
				$(document).on('click', '.tab', function (event) {
					event.preventDefault();
					var index = $(this).data('index');
					$('.tab').removeClass('active');
					$(this).addClass('active');
					$('.goodsBox').hide();
					$('.goodsBox').animate({ scrollTop: 0 }, 100);
					$('#goodsBox_' + index).show();
				});
			}
		}]);

		return FinLife;
	}();

	var finLife = new FinLife();
});