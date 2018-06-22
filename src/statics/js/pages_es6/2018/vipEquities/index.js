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
			let self = this;
			this.userId = getUrlParam('userId');
			this.type = getUrlParam('type');
			// this.userPhone = getUrlParam('userPhone');
			// console.log(this.userPhone);
			this.swiper = null;
			this.swiper = new Swiper('.swiper-container', {
				autoplayDisableOnInteraction: false,
				loop: false,
				centeredSlides: true,
				slidesPerView: 3,
				onInit: function (swiper) {

				},
				onSlideChangeEnd: function ($swiper) {
					self.openRight($swiper.activeIndex);
				}
			});
			if (!this.type) {
				this.app();
				if (self.userId) {
					this.loadPage();
					// this.getUserUri();
				} else {
					$('.userInfo').hide();
					$('.swiper-wrapper img').show();
				}
			} else if (this.type == 'h5') {
				$('.userInfo').hide();
				$('.swiper-wrapper img').show();
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
					'title': '会员权益',
					'href': '',
					'icon': 0,
					'backBtn': btnType
				}, function(responseData) {
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

				$(document).on('click', '.item', function () {
					let pageType = $(this).data('type');
					if (!pageType) {
						return false;
					}
					bridge.callHandler('goPageHandler', { 'title': '', 'icon': 0, 'backBtn': 0 }, function (responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) location.href = `${webUrl}/view/2018/vipEquities/explain.html?interaction=1&pageType=${pageType}&userId=${self.userId}`;
					});
				});
				if (!self.userId) {
					bridge.registerHandler('goBackBtnHandler', function (data, responseCallback) {
						// let finLife = (self.derive == 'finLife')?'finLife/' : '';
						// let backLink = webUrl + "/view/2017/thirdAnnicersary/"+ finLife +"index.html?interaction=1&userId=" + getUrlParam('userId');
						let backLink = webUrl + "/view/2018/vipEquityIntroduce/index.html?interaction=1";
						let responseData = { 'title': "会员权益介绍", 'href': backLink, 'icon': 1, 'backBtn': 1 };
						responseCallback(responseData);
						if (typeof data == "string") data = JSON.parse(data);
						if (data.result) location.href = backLink;
					});
				}
				
			});
			//E-APP交互相关
		}
		listen() {
			let self = this;
			if (self.type == 'h5') {
				$('.item').on('click', function () {
					let pageType = $(this).data('type');
					if (pageType) {
						location.href = '/view/2018/vipEquities/explain.html?type=h5&pageType=' + pageType;
					}
				});
			}

			$(document).on('click', '#accountTip', function () {
				layer.open({
					className: 'tipPop',
					content: `<p>有效期：会员享有的降级缓冲期，当账户资产总额不满足当前会员等级条件时开启倒计时，在有效期结束前资产总额重新达到当前会员等级条件，即可继续维持当前会员等级；若有效期结束时资产总额仍未达到会员等级条件，则降至账户资产总额对应的会员等级；会员等级不同有效期不同，等级越高，有效期越长。</p><span class="closeBtn"></span>`,
				});
			});
			$(document).on('click', '.closeBtn', function () {
				layer.closeAll();
			});
		}
		loadPage() {
			let self = this;
			$.ajax({
				url: pcUrl + '/vipPrivilege.html',
				// url: 'http://192.168.188.7:8081/vipPrivilege.html',
				type: 'get',
				dataType: 'jsonp',
				data: {
					userId: self.userId
				},
			})
				.done(function (data) {
					if (data.result) {
						let vipLevel = parseInt(data.vipConfig.vipLevel);
						$('.account span').text(parseFloat(data.totalAccont).toFixed(2));
						// if (data.data && data.data.newPicName!='') {
						// 	$('.user .userIcon').attr('src', data.data.newPicName);
						// }
						if (vipLevel == -1) {
							$('.swiper-wrapper img').show();
							$('.tip').text('资产总额大于0元，可升级成为会员').show();
							$('.user span').html(data.phone);
							$('#vipLevel').hide();							
						} else {
							$('.user span').html(data.phone);
							$('#vipLevel').attr('src', '/statics/img/pages/2018/vipEquities/v' + vipLevel + '.png').show();
							self.swiper.slideTo(vipLevel, 10, false);
							setTimeout(function () {
								$('.swiper-wrapper img').show();
							}, 10);
						}

						if (data.totalAccont < data.vipConfig.accountLower) {
							$('.tip').html('当前资产总额低于会员等级要求，有效期至' + data.expirationTime +' <img src="/statics/img/pages/2018/vipEquities/tipIcon.png" id="accountTip" alt="">').show();
						}
						self.openRight(vipLevel);
					} else {
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
					}

				})
				.fail(function () {
					console.log("error");
				});
		}
		openRight(level) {
			if (level >= 1) {
				$('.item[data-index="3"]').removeClass('close');
			} else {
				$('.item[data-index="3"]').addClass('close');
			}
			if (level >= 3) {
				$('.item[data-index="3"] ._text').text('加息：+0.2%');
				$('.item[data-index="4"],.item[data-index="5"]').removeClass('close');
			} else {
				$('.item[data-index="4"],.item[data-index="5"]').addClass('close');
				$('.item[data-index="3"] ._text').text('加息：+0.1%');
			}

			if (level >= 4) {
				$('.item[data-index="1"] ._text').text('红包+生活券+神秘礼品');
			} else {
				$('.item[data-index="1"] ._text').text('红包+生活券');
			}

			if (level >= 5) {
				$('.item[data-index="2"] ._text').text('当前等级：4次');
				$('.item[data-index="3"] ._text').text('加息：+0.3%');
			} else if (level >= 2) {
				$('.item[data-index="2"] ._text').text('当前等级：3次');
			} else {
				$('.item[data-index="2"] ._text').text('当前等级：2次');
			}
		}
	}
	let app = new App();
});