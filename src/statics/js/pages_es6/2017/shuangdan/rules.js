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
			if (this.type != 'h5') {
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
					let data = {
						'Javascript Responds': 'Wee!'
					}
					responseCallback(data);
				});

				bridge.callHandler('goLoadPageHandler', {
					'title': '活动规则',
					'href': '',
					'icon': 0,
					'backBtn': 0
				}, function(responseData) {
					if (typeof responseData == "string") responseData = JSON.parse(responseData);
					if (responseData.result) console.log("BANNER进入加载成功");
				});
				
				// 返回
				bridge.registerHandler('goBackBtnHandler', function(data, responseCallback) {
					let backLink = `${webUrl}/view/2017/shuangdan/index.html?interaction=1&userId=${self.userId}`;
					let responseData = {
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
		listen() {
			let self = this;
		}
	}
	let finLife = new FinLife();
});