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
				var self = this;
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
					onInit: function onInit(swiper) {},
					onSlideChangeEnd: function onSlideChangeEnd($swiper) {
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
						'title': '会员权益',
						'href': '',
						'icon': 0,
						'backBtn': btnType
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

					$(document).on('click', '.item', function () {
						var pageType = $(this).data('type');
						if (!pageType) {
							return false;
						}
						bridge.callHandler('goPageHandler', { 'title': '', 'icon': 0, 'backBtn': 0 }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) location.href = webUrl + '/view/2018/vipEquities/explain.html?interaction=1&pageType=' + pageType + '&userId=' + self.userId;
						});
					});
					if (!self.userId) {
						bridge.registerHandler('goBackBtnHandler', function (data, responseCallback) {
							// let finLife = (self.derive == 'finLife')?'finLife/' : '';
							// let backLink = webUrl + "/view/2017/thirdAnnicersary/"+ finLife +"index.html?interaction=1&userId=" + getUrlParam('userId');
							var backLink = webUrl + "/view/2018/vipEquityIntroduce/index.html?interaction=1";
							var responseData = { 'title': "会员权益介绍", 'href': backLink, 'icon': 1, 'backBtn': 1 };
							responseCallback(responseData);
							if (typeof data == "string") data = JSON.parse(data);
							if (data.result) location.href = backLink;
						});
					}
				});
				//E-APP交互相关
			}
		}, {
			key: 'listen',
			value: function listen() {
				var self = this;
				if (self.type == 'h5') {
					$('.item').on('click', function () {
						var pageType = $(this).data('type');
						if (pageType) {
							location.href = '/view/2018/vipEquities/explain.html?type=h5&pageType=' + pageType;
						}
					});
				}

				$(document).on('click', '#accountTip', function () {
					layer.open({
						className: 'tipPop',
						content: '<p>\u6709\u6548\u671F\uFF1A\u4F1A\u5458\u4EAB\u6709\u7684\u964D\u7EA7\u7F13\u51B2\u671F\uFF0C\u5F53\u8D26\u6237\u8D44\u4EA7\u603B\u989D\u4E0D\u6EE1\u8DB3\u5F53\u524D\u4F1A\u5458\u7B49\u7EA7\u6761\u4EF6\u65F6\u5F00\u542F\u5012\u8BA1\u65F6\uFF0C\u5728\u6709\u6548\u671F\u7ED3\u675F\u524D\u8D44\u4EA7\u603B\u989D\u91CD\u65B0\u8FBE\u5230\u5F53\u524D\u4F1A\u5458\u7B49\u7EA7\u6761\u4EF6\uFF0C\u5373\u53EF\u7EE7\u7EED\u7EF4\u6301\u5F53\u524D\u4F1A\u5458\u7B49\u7EA7\uFF1B\u82E5\u6709\u6548\u671F\u7ED3\u675F\u65F6\u8D44\u4EA7\u603B\u989D\u4ECD\u672A\u8FBE\u5230\u4F1A\u5458\u7B49\u7EA7\u6761\u4EF6\uFF0C\u5219\u964D\u81F3\u8D26\u6237\u8D44\u4EA7\u603B\u989D\u5BF9\u5E94\u7684\u4F1A\u5458\u7B49\u7EA7\uFF1B\u4F1A\u5458\u7B49\u7EA7\u4E0D\u540C\u6709\u6548\u671F\u4E0D\u540C\uFF0C\u7B49\u7EA7\u8D8A\u9AD8\uFF0C\u6709\u6548\u671F\u8D8A\u957F\u3002</p><span class="closeBtn"></span>'
					});
				});
				$(document).on('click', '.closeBtn', function () {
					layer.closeAll();
				});
			}
		}, {
			key: 'loadPage',
			value: function loadPage() {
				var self = this;
				$.ajax({
					url: pcUrl + '/vipPrivilege.html',
					// url: 'http://192.168.188.7:8081/vipPrivilege.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					}
				}).done(function (data) {
					if (data.result) {
						var vipLevel = parseInt(data.vipConfig.vipLevel);
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
							$('.tip').html('当前资产总额低于会员等级要求，有效期至' + data.expirationTime + ' <img src="/statics/img/pages/2018/vipEquities/tipIcon.png" id="accountTip" alt="">').show();
						}
						self.openRight(vipLevel);
					} else {
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}).fail(function () {
					console.log("error");
				});
			}
		}, {
			key: 'openRight',
			value: function openRight(level) {
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
		}]);

		return App;
	}();

	var app = new App();
});