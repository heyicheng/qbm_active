'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
	require('jquery');
	var layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);

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
				if (this.type != 'h5') {
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
						var data = {
							'Javascript Responds': 'Wee!'
						};
						responseCallback(data);
					});

					bridge.callHandler('goLoadPageHandler', {
						'title': '活动规则',
						'href': '',
						'icon': 0,
						'backBtn': 0
					}, function (responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) console.log("BANNER进入加载成功");
					});

					// 返回
					bridge.registerHandler('goBackBtnHandler', function (data, responseCallback) {
						var backLink = webUrl + '/view/2017/shuangdan/index.html?interaction=1&userId=' + self.userId;
						var responseData = {
							'title': "双蛋活动",
							'href': backLink,
							'icon': 1,
							'backBtn': 1
						};
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
		}]);

		return FinLife;
	}();

	var finLife = new FinLife();
});