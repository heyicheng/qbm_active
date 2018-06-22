'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
	require('jquery');
	var layer = require('layer');
	require('layerCss');
	var swiper = require('swiper');
	require('swiperCss');

	require('fastclick');
	FastClick.attach(document.body);

	var App = function () {
		function App() {
			_classCallCheck(this, App);

			this.init = this.init.bind(this);
			this.listen = this.listen.bind(this);
			this.init();
			this.listen();
		}

		_createClass(App, [{
			key: 'init',
			value: function init() {
				this.userId = getUrlParam('userId');
				this.type = getUrlParam('type');
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

					bridge.callHandler('goLoadPageHandler', {
						'title': '会员权益介绍',
						'href': '',
						'icon': 0,
						'backBtn': 1
					}, function (responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) console.log("BANNER进入加载成功");
					});

					$(document).on('click', '#goFinancing', function (event) {
						bridge.callHandler('goAppModule', {
							'target': 'financing'
						}, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
					});

					$(document).on('click', '#goVip', function () {
						bridge.callHandler('goPageHandler', { 'title': '', 'icon': 0, 'backBtn': 0 }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) location.href = webUrl + '/view/2018/vipEquities/index.html?interaction=1';
						});
					});
				});
				//E-APP交互相关
			}
		}, {
			key: 'listen',
			value: function listen() {
				var self = this;
				if (self.type == 'h5') {
					$('#goVip').on('click', function () {
						location.href = '/view/2018/vipEquities/index.html?type=h5';
					});
					$('#goFinancing').on('click', function () {
						location.href = "https://www.qbm360.com/applink.html";
					});
				}
				$('#btn1').on('click', function (event) {
					event.preventDefault();
					/* Act on the event */
					$(document).scrollTop($('#equity1').offset().top - 10);
				});
				$('#btn2').on('click', function (event) {
					event.preventDefault();
					/* Act on the event */
					$(document).scrollTop($('#equity2').offset().top - 10);
				});
				$('#btn3').on('click', function (event) {
					event.preventDefault();
					/* Act on the event */
					$(document).scrollTop($('#equity3').offset().top - 10);
				});
				$('#btn4').on('click', function (event) {
					event.preventDefault();
					/* Act on the event */
					$(document).scrollTop($('#equity4').offset().top - 10);
				});
			}
		}]);

		return App;
	}();

	var app = new App();
});