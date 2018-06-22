'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
	require('jquery');
	var layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);

	var awards = ['iPhone', //L1
	'iWatch', //L7
	'saodi', //L9
	'kindle', //L6
	'jiashi', //L4
	'award_50', //L3
	'award_30', 'award_5', //L8
	'award_dou_3', //L2
	'award_dou_1'];

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
				this.loadPage();
				if (!this.type) {
					this.app();
				}
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

					bridge.registerHandler('goBackBtnHandler', function (data, responseCallback) {
						var backLink = webUrl + "/view/2017/thirdAnnicersary/lottery/index.html?interaction=1&userId=" + getUrlParam('userId');
						var responseData = { 'title': "投资赢iPhone，抽兑随心意", 'href': backLink, 'icon': 2, 'backBtn': 0 };
						responseCallback(responseData);
						if (typeof data == "string") data = JSON.parse(data);
						if (data.result) location.href = backLink;
					});
				});
				//E-APP交互相关
			}
		}, {
			key: 'listen',
			value: function listen() {
				var self = this;
			}
		}, {
			key: 'loadPage',
			value: function loadPage() {
				var self = this;
				$.ajax({
					url: webUrl + '/beans/getRewardList.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					}
				}).done(function (data) {
					if (data.result) {
						var list = data.data;
						var text = '';
						if (list.length < 1) {
							text = '<p style="text-align: center;font-size: 0.3rem;">\u60A8\u672A\u83B7\u5F97\u5956\u54C1\u54E6~</p>';
							$('.box').html(text);
							return false;
						}

						for (var i = 0; i < list.length; i++) {
							var item = list[i];
							var type = item.getType == '1' ? '大奖随意兑' : '奖品任性抽';
							text += '<div class="item">\n\t\t\t\t\t\t\t\t<span>' + type + ' <i>( ' + item.addtime.split(' ')[0] + ' )</i></span><span>' + item.detail.substring(2) + '</span>\n\t\t\t\t\t\t\t</div>';
							$('.box').html(text);
						}
					} else {
						layer.open({
							type: 1,
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}).fail(function () {
					console.log("error");
				});
			}
		}]);

		return FinLife;
	}();

	var finLife = new FinLife();
});