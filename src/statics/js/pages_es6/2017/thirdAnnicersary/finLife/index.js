define(function(require, exports, module) {
	require('jquery');
	let layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);

	class FinLife {
		constructor() {
			this.init = ::this.init;
			this.listen = ::this.listen;
			this.init();
			this.listen();
		}
		init() {
			this.userId = getUrlParam('userId');
			this.type = getUrlParam('type');
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
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge);
					}, false)
				}
			}
			connectWebViewJavascriptBridge(function(bridge) {

				//加载页面后调用
				bridge.init(function(message, responseCallback) {
					let data = { 'Javascript Responds': 'Wee!' }
					responseCallback(data);
				});
				bridge.callHandler('goLoadPageHandler', { 'title': '惊喜三重奏，生活“购”畅快', 'href': '', 'icon': 2, 'backBtn': 1 }, function(responseData) {
					if (typeof responseData == "string") responseData = JSON.parse(responseData);
					if (responseData.result) console.log("BANNER进入加载成功");
				});
				//发送分享信息给APP
				let sendInfo = {
					'shareTitle': '【三周年庆典】理财生活圈“购”畅快',
					'shareLink': `${webUrl}/view/2017/thirdAnnicersary/finLife/index.html?type=h5`,
					'shareIntro': '双11限时抢券，品牌尖货低价购！',
					'shareIcon': pcCdnUrl+'/images/shareIcon/znq.png'
				};

				bridge.callHandler('goSendShareInfoHandler', sendInfo, function(response) {
					if (typeof response == "string") response = JSON.parse(response);
					if (response.result) console.log("分享信息发送成功");
				});


				$(document).on('click', '#rules', function() {
					bridge.callHandler('goPageHandler', { 'title': '活动规则', 'icon': 0, 'backBtn': 0 }, function(responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) location.href = `${webUrl}/view/2017/thirdAnnicersary/finLife/rules.html?interaction=1&userId=${self.userId}`;
					});
				});

				$(document).on('click', '.goGrabTicket ._btn', function() {
					bridge.callHandler('goPageHandler', { 'title': '限时抢券，精品相赠', 'icon': 2, 'backBtn': 0 }, function(responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) location.href = `${webUrl}/view/2017/thirdAnnicersary/finLife/grabTicket.html?interaction=1&derive=finLine&userId=${self.userId}`;
					});
				});

				$(document).on('click', '.goShopping ._btn', function() {
					bridge.callHandler('goPageHandler', { 'title': '限时狂欢，够畅快', 'icon': 2, 'backBtn': 0 }, function(responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) location.href = `${webUrl}/view/2017/thirdAnnicersary/finLife/shopping.html?interaction=1&derive=finLine&userId=${self.userId}`;
					});
				});

				$(document).on('click', '.goMain ._btn', function() {
					alert('main');
					bridge.callHandler('goPageHandler', { 'title': '三周年庆典', 'icon': 1, 'backBtn': 0 }, function(responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) location.href = `${webUrl}/view/2017/thirdAnnicersary/index.html?interaction=1&userId=${self.userId}`;
					});
				});

				// 返回
				// bridge.registerHandler('goBackBtnHandler', function(data, responseCallback) {
				// 	let backLink = `/view/2017/thirdAnnicersary/index.html?interaction=1&userId=${self.userId}`;
				// 	let responseData = { 'title': "三周年庆典", 'href': backLink, 'icon': 1, 'backBtn': 1 };
				// 	responseCallback(responseData);
				// 	if (typeof data == "string") data = JSON.parse(data);
				// 	if (data.result) location.href = backLink;
				// });
				

			});
			//E-APP交互相关
		}
		listen() {
			let self = this;
			if (self.type == "h5") {
				$(document).on('click', '#rules', function() {
					location.href = `/view/2017/thirdAnnicersary/finLife/rules.html?type=h5`;
				});

				$(document).on('click', '.goGrabTicket ._btn', function() {
					location.href = `/view/2017/thirdAnnicersary/finLife/grabTicket.html?type=h5`;
				});

				$(document).on('click', '.goShopping ._btn', function() {
					location.href = `/view/2017/thirdAnnicersary/finLife/shopping.html?type=h5`;
				});

				$(document).on('click', '.goMain ._btn', function() {
					location.href = `/view/2017/thirdAnnicersary/index.html?type=h5`;
				});
			}
		}
	}
	let finLife = new FinLife();
});