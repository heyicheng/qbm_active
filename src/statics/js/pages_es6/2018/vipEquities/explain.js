define(function (require, exports, module) {
	require('jquery');
	let layer = require('layer');
	require('layerCss');
	let swiper = require('swiper');
	require('swiperCss');

	require('fastclick');
	FastClick.attach(document.body);

	class App {
		constructor() {
			this.init = :: this.init;
			this.listen = :: this.listen;
			this.init();
			this.listen();
		}
		init() {
			this.userId = getUrlParam('userId');
			this.type = getUrlParam('type');
			this.pageType = getUrlParam('pageType') ? getUrlParam('pageType'): 'jrgh';
			this.title = '节日关怀';

			let $src = $('.top img').data('src');
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
			$('head').append('<title>'+ this.title +'</title>');
			if (!this.type) {
				this.app();
			}
		}
		app() {
			let self = this;
			//S-APP交互相关
			function connectWebViewJavascriptBridge(callback) { //判断APP是否支持WebViewJavascriptBridge
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge);
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function () {
						callback(WebViewJavascriptBridge);
					}, false)
				}
			}
			connectWebViewJavascriptBridge(function (bridge) {

				//加载页面后调用
				bridge.init(function (message, responseCallback) {
					let data = { 'Javascript Responds': 'Wee!' }
					responseCallback(data);
				});
				let btnType = self.userId ? 1 : 0;
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
					let backLink = webUrl + "/view/2018/vipEquities/index.html?interaction=1&userId=" + self.userId;
					if (!self.userId) {
						backLink = webUrl + "/view/2018/vipEquities/index.html?interaction=1";
					}
					let responseData = { 'title': "会员权益", 'href': backLink, 'icon': 0, 'backBtn': btnType };
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

				$(document).on('click', '#goQfh',function() {
					bridge.callHandler('goPageHandler', { 'title': '', 'icon': 0, 'backBtn': 0 }, function (responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) location.href = `https://www.qbm360.com/service/media-news-detail.html?id=735&interaction=1`;
					});
				});

			});
			//E-APP交互相关
		}
		listen() {
			let self = this;
			if (self.type == 'h5') {
				$('#goQfh').on('click', function () {
					location.href = 'https://www.qbm360.com/service/media-news-detail.html?id=735';
				});
				$('#goFinancing').on('click', function () {
					location.href = "https://www.qbm360.com/applink.html";
				});
			}
		}

	}
	let app = new App();
});