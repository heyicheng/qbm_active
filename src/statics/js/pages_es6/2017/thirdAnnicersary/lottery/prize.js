define(function(require, exports, module) {
	require('jquery');
	let layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);

	let awards = [
		'iPhone', //L1
		'iWatch', //L7
		'saodi', //L9
		'kindle', //L6
		'jiashi', //L4
		'award_50', //L3
		'award_30',
		'award_5', //L8
		'award_dou_3', //L2
		'award_dou_1', //L5
	];
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
			this.loadPage();
			if (!this.type) {
				this.app();
			}
		}
		app() {
			let self = this;
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
					var data = { 'Javascript Responds': 'Wee!' }
					responseCallback(data);
				});

				bridge.registerHandler('goBackBtnHandler', function(data, responseCallback) {
					var backLink = webUrl + "/view/2017/thirdAnnicersary/lottery/index.html?interaction=1&userId=" + getUrlParam('userId');
					var responseData = { 'title': "投资赢iPhone，抽兑随心意", 'href': backLink, 'icon': 2, 'backBtn': 0 };
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
		loadPage() {
			let self = this;
			$.ajax({
					url: webUrl + '/beans/getRewardList.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					},
				})
				.done(function(data) {
					if (data.result) {
						let list = data.data;
						let text = '';
						if(list.length<1){
							text = `<p style="text-align: center;font-size: 0.3rem;">您未获得奖品哦~</p>`;
							$('.box').html(text);
							return false;
						}

						for (let i = 0; i < list.length; i++) {
							let item = list[i];
							let type = item.getType == '1'?'大奖随意兑' : '奖品任性抽';
							text += `<div class="item">
								<span>${type} <i>( ${item.addtime.split(' ')[0]} )</i></span><span>${item.detail.substring(2)}</span>
							</div>`;
							$('.box').html(text);
						}
					} else {
						layer.open({
							type: 1,
							content: data.msg,
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
					}

				})
				.fail(function() {
					console.log("error");
				});
			
		}
	}
	let finLife = new FinLife();
});