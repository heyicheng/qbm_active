define(function(require, exports, module) {
	require('jquery');
	let layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);
	// webUrl = 'http://192.168.188.50:8686';

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
			this.loadPage();
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
					'title': '我的奖品',
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
		loadPage() {
			let self = this;
			$.ajax({
					url: webUrl + '/newyear/getRewardList.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					},
				})
				.done(function(data) {
					if (data.result) {
						let list = data.recordList;
						let text = '';
						if(list.length<1){
							text = `<img src="/statics/img/pages/2017/shuangdan/noPrize.png" alt="" />`;
							$('.box').html(text);
							return false;
						} else {
							for (let i = 0; i < list.length; i++) {
								let item = list[i];
								text += `<div class="item">
									<span>${item.detail.substring(2)}</span><span>${item.addtime.split(' ')[0]}</span>
								</div>`;
							}
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