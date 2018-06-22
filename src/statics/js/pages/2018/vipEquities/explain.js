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
				this.pageType = getUrlParam('pageType') ? getUrlParam('pageType') : 'jrgh';
				this.title = '节日关怀';

				var $src = $('.top img').data('src');
				$('.top img').attr('src', $src + this.pageType + '.png');
				$('.top img').show();
				$('.' + this.pageType).show();
				$('title').remove();
				switch (this.pageType) {
					case 'jrgh':
						this.title = '节日关怀';
						break;
					case 'mftx':
						this.title = '免费提现次数';
						break;
					case 'zsdz':
						this.title = '专属定制';
						break;
					case 'gdlc':
						this.title = '高端会员专享';
						break;
					case 'qfh':
						this.title = '钱粉会';
						break;
					default:
						this.title = '节日关怀';
						break;
				}
				$('head').append('<title>' + this.title + '</title>');
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
					var btnType = self.userId ? 1 : 0;
					bridge.callHandler('goLoadPageHandler', {
						'title': self.title,
						'href': '',
						'icon': 0,
						'backBtn': 0
					}, function (responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) console.log("BANNER进入加载成功");
					});

					//返回
					bridge.registerHandler('goBackBtnHandler', function (data, responseCallback) {
						// let finLife = (self.derive == 'finLife')?'finLife/' : '';
						// let backLink = webUrl + "/view/2017/thirdAnnicersary/"+ finLife +"index.html?interaction=1&userId=" + getUrlParam('userId');
						var backLink = webUrl + "/view/2018/vipEquities/index.html?interaction=1&userId=" + self.userId;
						if (!self.userId) {
							backLink = webUrl + "/view/2018/vipEquities/index.html?interaction=1";
						}
						var responseData = { 'title': "会员权益", 'href': backLink, 'icon': 0, 'backBtn': btnType };
						responseCallback(responseData);
						if (typeof data == "string") data = JSON.parse(data);
						if (data.result) location.href = backLink;
					});

					$(document).on('click', '#goFinancing', function (event) {
						bridge.callHandler('goAppModule', {
							'target': 'financing'
						}, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
					});

					$(document).on('click', '#goQfh', function () {
						bridge.callHandler('goPageHandler', { 'title': '', 'icon': 0, 'backBtn': 0 }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) location.href = 'https://www.qbm360.com/service/media-news-detail.html?id=735&interaction=1';
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
					$('#goQfh').on('click', function () {
						location.href = 'https://www.qbm360.com/service/media-news-detail.html?id=735';
					});
					$('#goFinancing').on('click', function () {
						location.href = "https://www.qbm360.com/applink.html";
					});
				}
			}
		}]);

		return App;
	}();

	var app = new App();
});