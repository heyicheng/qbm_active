'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
	require('jquery');
	var layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);
	var awards = {
		level1: {
			imgUrl: 'iPhone',
			name: 'iPhone8 256G'
		},
		level2: {
			imgUrl: 'jintiao',
			name: '中国黄金投资黄金20g'
		},
		level3: {
			imgUrl: 'jintiao',
			name: '中国黄金投资黄金10g'
		},
		level4: {
			imgUrl: 'jintiao',
			name: '中国黄金投资黄金5g'
		},
		level5: {
			imgUrl: 'jintiao',
			name: '中国黄金投资黄金2g'
		},
		level6: {
			imgUrl: 'youka',
			name: '100元油卡'
		},
		level7: {
			imgUrl: 'rp_30',
			name: '30元无门槛红包'
		},
		level8: {
			imgUrl: 'rp_5',
			name: '5元无门槛红包'
		},
		level9: {
			imgUrl: 'rp_2',
			name: '2元无门槛红包'
		},
		level10: {
			imgUrl: '', //L5
			name: '再砸一次'
		},
		level11: {
			imgUrl: '100', //L5
			name: '100活动金'
		}
	};
	// webUrl = 'http://192.168.188.50:8686';

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
				var self = this;
				this.userId = getUrlParam('userId');
				this.type = getUrlParam('type');

				this.dou = 0;
				this.chui = false;
				this.exchanged = false;
				self.freeCount = 0;
				this.loadPage();
				if (!this.type) {
					this.app();
				}
				var pop = $('.danBox ._pop');
				setInterval(function () {
					if (pop.data('num') == 1) {
						pop.data('num', 2);
						pop.html('活动金也可兑换金条哦!');
					} else {
						pop.data('num', 1);
						pop.html('每日分享<br>免费砸一次哦!');
					}
				}, 5000);
				// var aEle = document.querySelector("#_audio");
				this.audio = document.getElementById('_audio');
				// this.audio = new Audio();
				this.audio.src = "/statics/img/pages/2017/shuangdan/dansui.mp3";
				// this.audio.addEventListener("loadeddata",function() {
				// 	self.audio.addEventListener("playing", function(){
				// 		alert('playing');
				// 	});
				// 	if (self.audio != null) {
				// 		if (self.audio.paused) {
				// 			var evt;
				// 			alert('a');
				// 			if (document.createEvent) {
				// 				evt = document.createEvent("MouseEvents");
				// 				if (evt.initMouseEvent) {
				// 					evt.initMouseEvent("mousedown", true, true, window, 0, 0, 4, 4, 0, false, false, false, false, 0, null);
				// 					aEle.dispatchEvent(evt);
				// 				}
				// 			}
				// 		}else {
				// 			alert('b');
				// 		}
				// 	}
				// });

				// this.audio = new Audio("/statics/img/pages/2017/shuangdan/dansui.mp3");
				// this.audio.src = "/statics/img/pages/2017/shuangdan/dansui.mp3";
				// this.audio.id = '_audio';
				// this.audio.load();
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

					// bridge.callHandler('goLoadPageHandler', {
					// 	'title': '双蛋活动',
					// 	'href': '',
					// 	'icon': 1,
					// 	'backBtn': 1
					// }, function(responseData) {
					// 	if (typeof responseData == "string") responseData = JSON.parse(responseData);
					// 	if (responseData.result) console.log("BANNER进入加载成功");
					// });
					//发送分享信息给APP
					// let sendInfo = {
					// 	'shareTitle': '砸金蛋，赢金条',
					// 	'shareLink': `${webUrl}/view/2017/shuangdan/index.html?type=h5`,
					// 	'shareIntro': '中国黄金投资金条、iPhone 8、百元油卡任你砸',
					// 	'shareIcon': pcCdnUrl + '/images/shareIcon/znq.png'
					// };

					// bridge.callHandler('goSendShareInfoHandler', sendInfo, function(response) {
					// 	if (typeof response == "string") response = JSON.parse(response);
					// 	if (response.result) console.log("分享信息发送成功");
					// });
					//自定义分享成功回调
					bridge.registerHandler('goShareStateHandler', function (data, responseCallback) {
						//alert("自定义分享成功回调");
						if (typeof data == "string") data = JSON.parse(data);
						if (data.result) {
							console.log(data.place);
							if (data.place == 2) {
								$.ajax({
									url: webUrl + '/newyear/share.html',
									type: 'get',
									dataType: 'jsonp',
									data: {
										userId: self.userId
									}
								}).done(function (data) {
									if (data.result) {
										layer.open({
											className: 'successPop',
											content: '<div class="awardBox">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img class=\'icon\' src="/statics/img/pages/2017/shuangdan/successIcon.png" alt="" />\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="title">\u5206\u4EAB\u6210\u529F\uFF01</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p>\u606D\u559C\u60A8\u83B7\u5F97\u4E00\u6B21\u7838\u86CB\u673A\u4F1A</p>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>',
											btn: ['确认'],
											end: function end() {
												self.freeCount = data.freeCount;
												if (data.freeCount > 0) {
													$('.dan ._text').text('\u5F53\u524D\u53EF\u514D\u8D39\u7838' + data.freeCount + '\u6B21');
												} else {
													$('.dan ._text').html('200\u6D3B\u52A8\u91D1<br>\u53EF\u4EE5\u7838\u4E00\u6B21\u54E6\uFF01');
												}
											}
										});
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
						}
					});

					// 活动规则
					$(document).on('click', '.rules', function () {
						bridge.callHandler('goPageHandler', {
							'title': '活动规则',
							'icon': 0,
							'backBtn': 0
						}, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) location.href = webUrl + '/view/2017/shuangdan/rules.html?interaction=1&userId=' + self.userId;
						});
					});
					//我的奖品
					$(document).on('click', '.prizes', function () {
						var backLink = webUrl + '/view/2017/shuangdan/index.html';
						var userId = self.userId;
						if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
							bridge.callHandler('goLoginHandler', {
								'href': backLink + '?interaction=1'
							}, function (responseData) {
								if (typeof responseData == "string") responseData = JSON.parse(responseData);
								if (responseData.result) console.log("success");
							});
							return false;
						} else {
							bridge.callHandler('goPageHandler', {
								'title': '我的奖品',
								'icon': 0,
								'backBtn': 0
							}, function (responseData) {
								if (typeof responseData == "string") responseData = JSON.parse(responseData);
								if (responseData.result) location.href = webUrl + '/view/2017/shuangdan/prize.html?interaction=1&userId=' + self.userId;
							});
						}
					});
					//立即投资
					$(document).on('click', '.touzi span[type="1"]', function (event) {
						bridge.callHandler('goAppModule', {
							'target': 'financing'
						}, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
					});

					//登录
					$(document).on("click", '._lotteryBtn, .exchangeAward', function () {
						var backLink = webUrl + '/view/2017/shuangdan/index.html';
						var userId = self.userId;
						if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
							bridge.callHandler('goLoginHandler', {
								'href': backLink + '?interaction=1'
							}, function (responseData) {
								if (typeof responseData == "string") responseData = JSON.parse(responseData);
								if (responseData.result) console.log("success");
							});
						} else {}
					});
				});
				//E-APP交互相关
			}
		}, {
			key: 'listen',
			value: function listen() {
				var self = this;
				if (self.type == "h5") {
					$(document).on('click', '.rules', function () {
						location.href = '/view/2017/shuangdan/rules.html?type=h5';
					});
					$(document).on('click', '.prizes', function () {
						location.href = "https://www.qbm360.com/applink.html";
					});
				}
				$(document).on('click', '.dan', function (event) {
					event.preventDefault();
					/* Act on the event */
					if (self.type == 'h5') {
						location.href = 'https://www.qbm360.com/applink.html';
						return false;
					}
					if (self.chui) {
						return false;
					}
					var userId = self.userId;
					if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
						return false;
					}
					if (self.dou < 200 && self.freeCount == 0) {
						layer.open({
							className: 'touzi',
							content: '<div><div style=\'margin-bottom: 0.2rem;\'>\u6D3B\u52A8\u91D1\u4E0D\u8DB3\u54E6~</div><p style=\'font-size: 14px;\'>\u6295\u8D44\u53EF\u83B7\u5F97\u66F4\u591A\u7838\u91D1\u86CB\u6B21\u6570\u54E6\uFF01</p></div>',
							style: 'font-size: 18px;',
							btn: ['立即投资', '遗憾离开'],
							yes: function yes() {
								layer.closeAll();
							}
						});
					} else {
						self.lottery();
					}
				});
				/*兑换*/
				$(document).on('click', '.exchangeBtn', function () {
					if (self.type == 'h5') {
						location.href = "https://www.qbm360.com/applink.html";
						return false;
					}
					var userId = self.userId;
					if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
						return false;
					}
					var oIndex = $(this).data('index');
					var num = $(this).data('num');
					if (self.dou < num) {
						layer.open({
							className: 'touzi',
							content: '<div><div style=\'margin-bottom: 0.2rem;\'>\u6D3B\u52A8\u91D1\u4E0D\u8DB3\u54E6~</div><p style=\'font-size: 14px;\'>\u6295\u8D44\u53EF\u83B7\u5F97\u66F4\u591A\u6D3B\u52A8\u91D1\u54E6\uFF01</p></div>',
							style: 'font-size: 18px;',
							btn: ['立即投资', '遗憾离开'],
							yes: function yes() {
								layer.closeAll();
							}
						});
					} else {
						layer.open({
							content: '\u786E\u5B9A\u8981\u5151\u6362 ' + awards['level' + oIndex]['name'] + ' \u5417\uFF1F',
							style: 'font-size: 18px;',
							btn: ['立即兑换', '暂不兑换'],
							yes: function yes() {
								if (self.exchanged) {
									return false;
								} else {
									self.exchanged = true;
									self.exchange(oIndex);
								}
							}
						});
					}
				});
			}
		}, {
			key: 'lottery',
			value: function lottery() {
				var self = this;
				self.chui = true;
				$.ajax({
					url: webUrl + '/newyear/lottery.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					}
				}).done(function (data) {
					if (data.result) {
						$('.dan ._text').hide();
						$('.chui').addClass('chuiAnimation');
						setTimeout(function () {
							$('.dan').hide();
							$('.dansui').show();
							document.getElementById('_audio').play();
							// if (document.getElementById('#_audio') != null) {
							// 	alert(document.getElementById('#_audio').src);
							// }
							// document.getElementById('_audio').addEventListener("playing", function(){
							// 	alert('playing');
							// });
							// $('.danBox audio').get(0).play();
							// self.audio.play();
							setTimeout(function () {
								if (data.code != 0) {
									layer.open({
										className: 'successPop',
										content: '<div class="awardBox">\n\t\t\t\t\t\t\t\t\t\t\t<img class=\'icon\' src="/statics/img/pages/2017/thirdAnnicersary/lottery/successIcon.png" alt="" />\n\t\t\t\t\t\t\t\t\t\t\t<div class="title">\u606D\u559C\u60A8\uFF01</div>\n\t\t\t\t\t\t\t\t\t\t\t<p>\u83B7\u5F97 ' + awards['level' + data.level]['name'] + '</p>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\'_imgBox\' style=\'' + (awards['level' + data.level]['imgUrl'] ? '' : 'display:none;') + '\'><img src="/statics/img/pages/2017/shuangdan/' + awards['level' + data.level]['imgUrl'] + '.png" alt="" /></div>\n\t\t\t\t\t\t\t\t\t\t</div>',
										btn: ['确认'],
										end: function end() {
											self.chui = false;
											$('.dansui').hide();
											$('.dan ._text').show();
											$('.dan').show();
											$('.chui').removeClass('chuiAnimation');
										}
									});
								} else {
									layer.open({
										className: 'successPop fail',
										content: '<div class="awardBox">\n\t\t\t\t\t\t\t\t\t\t\t<img class=\'icon\' src="/statics/img/pages/2017/shuangdan/failIcon.png" alt="" />\n\t\t\t\t\t\t\t\t\t\t\t<div class="title">\u5F88\u9057\u61BE\uFF01\u60A8\u672A\u4E2D\u5956~</div>\n\t\t\t\t\t\t\t\t\t\t\t<p>\u4E0E\u5956\u54C1\u64E6\u80A9\u800C\u8FC7<br />\u7EE7\u7EED\u52AA\u529B\u62BD\u5927\u5956\u5427\uFF01</p>\n\t\t\t\t\t\t\t\t\t\t</div>',
										btn: ['确认'],
										end: function end() {
											self.chui = false;
											$('.dansui').hide();
											$('.dan ._text').show();
											$('.dan').show();
											$('.chui').removeClass('chuiAnimation');
										}
									});
								}
							}, 1000);

							$('.myMoney p span').text(Math.floor(data.yearTenderMoney));
							self.dou = Math.floor(data.yearTenderMoney);
							self.freeCount = data.freeCount;
							if (data.freeCount > 0) {
								$('.dan ._text').text('\u5F53\u524D\u53EF\u514D\u8D39\u7838' + data.freeCount + '\u6B21');
							} else {
								$('.dan ._text').html('200\u6D3B\u52A8\u91D1<br>\u53EF\u4EE5\u7838\u4E00\u6B21\u54E6\uFF01');
							}
						}, 1000);
					} else {
						layer.open({
							type: 1,
							content: data.msg,
							skin: 'msg',
							time: 2, //2秒后自动关闭
							end: function end() {
								self.chui = false;
							}
						});
					}
				}).fail(function () {
					console.log("error");
					layer.open({
						type: 1,
						content: '网络请求失败，请稍后重试',
						skin: 'msg',
						time: 2, //2秒后自动关闭
						end: function end() {
							self.chui = false;
						}
					});
					self.chui = false;
				});
			}
		}, {
			key: 'exchange',
			value: function exchange(index) {
				var self = this;
				$.ajax({
					url: webUrl + '/newyear/exchange.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId,
						level: index
					}
				}).done(function (data) {
					if (data.result) {
						$('.myMoney p span').text(Math.floor(data.yearTenderMoney));
						self.dou = Math.floor(data.yearTenderMoney);
						layer.open({
							className: 'successPop',
							content: '<div class="awardBox">\n\t\t\t\t\t\t\t\t<img class=\'icon\' src="/statics/img/pages/2017/shuangdan/successIcon.png" alt="" />\n\t\t\t\t\t\t\t\t<div class="title">\u606D\u559C\u60A8\uFF01</div>\n\t\t\t\t\t\t\t\t<p>\u83B7\u5F97 ' + awards['level' + index]['name'] + '</p>\n\t\t\t\t\t\t\t\t<div class=\'_imgBox ' + awards['level' + index]['imgUrl'] + '\'><img src="/statics/img/pages/2017/shuangdan/' + awards['level' + index]['imgUrl'] + '.png" alt="" /></div>\n\t\t\t\t\t\t\t</div>',
							btn: ['确认'],
							end: function end() {
								self.exchanged = false;
							}
						});
					} else {
						layer.closeAll();
						layer.open({
							type: 1,
							content: data.msg,
							skin: 'msg',
							time: 2, //2秒后自动关闭
							end: function end() {
								self.exchanged = false;
							}
						});
					}
				}).fail(function () {
					console.log("error");
					layer.open({
						type: 1,
						content: '网络请求失败，请稍后重试',
						skin: 'msg',
						time: 2, //2秒后自动关闭
						end: function end() {
							self.exchanged = false;
						}
					});
				});
			}
		}, {
			key: 'loadPage',
			value: function loadPage() {
				var self = this;
				var userId = self.userId;
				if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
					return false;
				}
				$.ajax({
					url: webUrl + '/newyear/getNewYearInfo.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					}
				}).done(function (data) {
					if (data.result) {
						$('.myMoney p span').text(Math.floor(data.yearTenderMoney));
						self.dou = Math.floor(data.yearTenderMoney);
						self.freeCount = data.freeCount;
						if (data.freeCount > 0) {
							$('.dan ._text').text('\u5F53\u524D\u53EF\u514D\u8D39\u7838' + data.freeCount + '\u6B21');
						}
					} else {
						layer.open({
							content: data.msg,
							style: 'background-color: rgba(0,0,0,0.5); color:#fff;font-size: 18px;',
							time: 3
						});
						return false;
					}
				}).fail(function () {
					console.log("error");
				});
			}
		}]);

		return FinLife;
	}();

	var finLife = new FinLife();
});