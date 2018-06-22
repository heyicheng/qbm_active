'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
	require('jquery');
	var layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);

	var text = ["双11“周年庆”14：00生活券即将开抢，你的小手准备好了么！", "双11“周年庆”明日11：00生活券即将开抢，你的小手准备好了么！", "双11“周年庆”11：00生活券已抢光，14：00更多礼券等你抢！", "双11“周年庆”16：00生活券已抢光，明日11：00更多礼券等你抢！"];
	var time = {
		"1": [1509505200, 1509516000, 1509523200],
		"2": [1509591600, 1509602400, 1509609600],
		"3": [1509678000, 1509688800, 1509696000]
	};

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
				this.userId = getUrlParam('userId');
				this.type = getUrlParam('type');
				this.derive = getUrlParam('derive');
				this.loadText();
				this.loadPage();
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

					bridge.callHandler('goLoadPageHandler', { 'title': '限时抢券，精品相赠', 'href': '', 'icon': 2, 'backBtn': 0 }, function (responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) console.log("BANNER进入加载成功");
					});
					//发送分享信息给APP
					var sendInfo = {
						'shareTitle': '【三周年庆典】理财生活圈限时抢券',
						'shareLink': webUrl + '/view/2017/thirdAnnicersary/finLife/grabTicket.html?type=h5',
						'shareIntro': '好券限时领，买就送好礼！',
						'shareIcon': pcCdnUrl + '/images/shareIcon/znq.png'
					};

					bridge.callHandler('goSendShareInfoHandler', sendInfo, function (response) {
						if (typeof response == "string") response = JSON.parse(response);
						if (response.result) console.log("分享信息发送成功");
					});

					//返回
					bridge.registerHandler('goBackBtnHandler', function (data, responseCallback) {
						// let finLife = (self.derive == 'finLife')?'finLife/' : '';
						// let backLink = webUrl + "/view/2017/thirdAnnicersary/"+ finLife +"index.html?interaction=1&userId=" + getUrlParam('userId');
						var backLink = webUrl + "/view/2017/thirdAnnicersary/index.html?interaction=1&userId=" + getUrlParam('userId');
						var responseData = { 'title': "三周年庆典", 'href': backLink, 'icon': 1, 'backBtn': 1 };
						// if(self.derive == 'finLife'){
						// 	responseData = { 'title': "惊喜三重奏，生活“购”畅快", 'href': backLink, 'icon': 2, 'backBtn': 1 };
						// }
						responseCallback(responseData);
						if (typeof data == "string") data = JSON.parse(data);
						if (data.result) location.href = backLink;
					});

					// 抢券
					$(document).on("click", '.grabText', function () {
						var backLink = webUrl + '/view/2017/thirdAnnicersary/finLife/grabTicket.html';
						var userId = self.userId;
						if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
							bridge.callHandler('goLoginHandler', { 'href': backLink + '?interaction=1' }, function (responseData) {
								if (typeof responseData == "string") responseData = JSON.parse(responseData);
								if (responseData.result) console.log("success");
							});
							return false;
						}
					});

					$(document).on('click', '#rules', function () {
						bridge.callHandler('goPageHandler', { 'title': '活动规则', 'icon': 0, 'backBtn': 0 }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) location.href = webUrl + '/view/2017/thirdAnnicersary/finLife/grabTicketRules.html?interaction=1&derive=' + self.derive + '&userId=' + self.userId;
						});
					});

					//跳转我的券包
					$("#ticketPackage").on("click", function () {
						var backLink = webUrl + '/view/2017/thirdAnnicersary/finLife/grabTicket.html';
						var userId = self.userId;
						if (userId == '(null)' || userId == null || userId == undefined) {
							bridge.callHandler('goLoginHandler', { 'href': backLink + '?interaction=1' }, function (responseData) {
								if (typeof responseData == "string") responseData = JSON.parse(responseData);
								if (responseData.result) console.log("success");
							});
						} else {
							bridge.callHandler('goAppModule', { 'target': 'ticketPackage' }, function (responseData) {
								if (typeof responseData == "string") responseData = JSON.parse(responseData);
								if (responseData.result) console.log("success");
							});
						}
					});
				});
				//E-APP交互相关
			}
		}, {
			key: 'listen',
			value: function listen() {
				var self = this;
				if (self.type == "h5") {
					$(document).on('click', '#ticketPackage', function (event) {
						location.href = "https://www.qbm360.com/applink.html";
					});
					$(document).on('click', '.grab', function (event) {
						location.href = "https://www.qbm360.com/applink.html";
						return false;
					});

					$(document).on('click', '#rules', function () {
						location.href = webUrl + '/view/2017/thirdAnnicersary/finLife/grabTicketRules.html?interaction=1&userId=' + self.userId;
					});
				} else {
					$(document).on('click', '.grab', function () {
						if ($(this).hasClass('disabled')) {
							return false;
						}
						$(this).addClass('disabled');
						setTimeout(function () {
							$('.grab').removeClass('disabled');
						}, 500);
						var userId = self.userId;
						if (userId != '(null)' && userId != null && userId != undefined && userId != '') {
							var nid = $(this).data('nid');
							var huodongId = $(this).data('huodongid');
							self.grabTicket(nid, huodongId);
						}
					});
				}
			}
		}, {
			key: 'grabTicket',
			value: function grabTicket(nid, huodongId) {
				var self = this;
				$.ajax({
					url: webUrl + '/anniversary/receiveLifeVoucher.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId,
						nid: nid,
						huodongId: huodongId
					}
				}).done(function (data) {
					console.log("success");
					layer.open({
						content: data.msg,
						skin: 'msg',
						time: 2, //2秒后自动关闭
						end: function end() {}
					});
				}).fail(function (data) {
					layer.open({
						content: '服务器繁忙，请稍后再试',
						skin: 'msg',
						time: 2, //2秒后自动关闭
						end: function end() {}
					});
				});
			}
		}, {
			key: 'loadText',
			value: function loadText() {
				$.ajax({
					url: webUrl + '/anniversary/horseRaceLamp.html',
					type: 'get',
					dataType: 'jsonp',
					data: {}
				}).done(function (data) {
					$('#marquee').text(data.msg);
					document.getElementById('marquee').start();
				}).fail(function () {
					console.log("error");
				});
			}
		}, {
			key: 'loadPage',
			value: function loadPage() {
				$.ajax({
					url: webUrl + '/anniversary/lifeVoucherList.html',
					type: 'get',
					dataType: 'jsonp',
					data: { userId: self.userId }
				}).done(function (data) {
					console.log("success");
					if (data.result) {
						var ticketHtml = '';
						var currenTime = data.currenTime;
						var d = new Date(currenTime * 1000);
						var month = d.getMonth() + 1;
						var day = d.getDate();
						var hour = d.getHours();

						var ticketsList = data.dataList;

						for (var i = 0; i < ticketsList.length; i++) {
							if (month < 11) {
								ticketHtml += '<div class="_ticket">\n\t\t\t\t\t\t\t\t\t\t<div class="_content">\n\t\t\t\t\t\t\t\t\t\t\t<p><span>\xA5</span><span class="_money">' + ticketsList[i].money + '</span>\u5468\u5E74\u5E86\u751F\u6D3B\u5238</p>\n\t\t\t\t\t\t\t\t\t\t\t<p>\u6295\u8D44\u6EE1<span>' + ticketsList[i].accountLimit + '</span>\u5143\uFF0C\u671F\u9650\u6EE1<span>' + Math.ceil(parseInt(ticketsList[i].timeLimit) / 30) + '</span>\u4E2A\u6708</p>\n\t\t\t\t\t\t\t\t\t\t\t<p>\u9002\u7528\u5546\u54C1\uFF1A\u6240\u6709\u5546\u54C1</p>\n\t\t\t\t\t\t\t\t\t\t\t<p>\u6709\u6548\u671F\uFF1A2017.11.10 - 2017.11.12</p>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class="grabText" data-nid="' + ticketsList[i].nid + '">\n\t\t\t\t\t\t\t\t\t\t\t<p>\u656C\u8BF7<br>\u671F\u5F85</p>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>';
							} else {
								if (ticketsList[i].num == 0) {
									ticketHtml += '<div class="_ticket">\n\t\t\t\t\t\t\t\t\t\t\t<div class="_content">\n\t\t\t\t\t\t\t\t\t\t\t\t<p><span>\xA5</span><span class="_money">' + ticketsList[i].money + '</span>\u5468\u5E74\u5E86\u751F\u6D3B\u5238</p>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\u6295\u8D44\u6EE1<span>' + ticketsList[i].accountLimit + '</span>\u5143\uFF0C\u671F\u9650\u6EE1<span>' + Math.ceil(parseInt(ticketsList[i].timeLimit) / 30) + '</span>\u4E2A\u6708</p>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\u9002\u7528\u5546\u54C1\uFF1A\u6240\u6709\u5546\u54C1</p>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\u6709\u6548\u671F\uFF1A2017.11.10 - 2017.11.12</p>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class="grabText over" data-huodongId="' + ticketsList[i].huodongid + '" data-nid="' + ticketsList[i].nid + '">\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\u5DF2\u62A2\u5149</p>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>';
								} else {
									ticketHtml += '<div class="_ticket">\n\t\t\t\t\t\t\t\t\t\t\t<div class="_content">\n\t\t\t\t\t\t\t\t\t\t\t\t<p><span>\xA5</span><span class="_money">' + ticketsList[i].money + '</span>\u5468\u5E74\u5E86\u751F\u6D3B\u5238</p>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\u6295\u8D44\u6EE1<span>' + ticketsList[i].accountLimit + '</span>\u5143\uFF0C\u671F\u9650\u6EE1<span>' + Math.ceil(parseInt(ticketsList[i].timeLimit) / 30) + '</span>\u4E2A\u6708</p>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\u9002\u7528\u5546\u54C1\uFF1A\u6240\u6709\u5546\u54C1</p>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\u6709\u6548\u671F\uFF1A2017.11.10 - 2017.11.12</p>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class="grabText grab" data-huodongid="' + ticketsList[i].huodongid + '" data-nid="' + ticketsList[i].nid + '">\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\u7ACB\u5373<br>\u62A2\u5238</p>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>';
								}
							}
						}

						$('.tickets').html(ticketHtml);

						var t = null;
						var timer = null;
						if (month >= 11 && day >= 1 && day < 4) {
							if (hour < 11) {
								$('.grabText').addClass('time').removeClass('grab');
								t = time[day][0] - currenTime;
								var hours = Math.floor(t / 60 / 60 % 60);
								var min = Math.floor(t / 60 % 60);
								var sec = Math.floor(t % 60);
								var countDownTime = (hours < 10 ? '0' + hours : hours) + ":" + (min < 10 ? '0' + min : min) + ":" + (sec < 10 ? '0' + sec : sec);

								$('.grabText').html('<p>\u8DDD\u5F00\u62A2<span>' + countDownTime + '</span></p>');

								timer = setInterval(function () {
									t -= 1;
									if (t == 0) {
										$('.grabText').addClass('grab').removeClass('time');
										$('.grabText').html('<p>\u7ACB\u5373<br>\u62A2\u5238</p>');
										clearInterval(timer);
										timer = null;
									}
									hours = Math.floor(t / 60 / 60 % 60);
									min = Math.floor(t / 60 % 60);
									sec = Math.floor(t % 60);
									countDownTime = (hours < 10 ? '0' + hours : hours) + ":" + (min < 10 ? '0' + min : min) + ":" + (sec < 10 ? '0' + sec : sec);

									$('.grabText').html('<p>\u8DDD\u5F00\u62A2<span>' + countDownTime + '</span></p>');
								}, 1000);
							} else {
								switch (hour) {
									case 13:
										t = time[day][1] - currenTime;
										break;
									case 15:
										t = time[day][2] - currenTime;
										break;
									default:
										t = 9999;
										break;
								}
								if (t <= 1800) {
									$('.over').addClass('time');
									$('#marquee').text('\u201C\u5468\u5E74\u5E86\u201D ' + (hour + 1) + ':00 \u751F\u6D3B\u5238\u5373\u5C06\u5F00\u62A2\uFF0C\u4F60\u7684\u5C0F\u624B\u51C6\u5907\u597D\u4E86\u4E48\uFF01');
									document.getElementById('marquee').start();

									var _min = Math.floor(t / 60 % 60);
									var _sec = Math.floor(t % 60);
									var _countDownTime = "00:" + (_min < 10 ? '0' + _min : _min) + ":" + (_sec < 10 ? '0' + _sec : _sec);

									$('.over').html('<p>\u8DDD\u5F00\u62A2<span>' + _countDownTime + '</span></p>');

									timer = setInterval(function () {
										t -= 1;
										if (t == 0) {
											if (t == 0) {
												$('.grabText').addClass('grab').removeClass('time').removeClass('over');
												$('.grabText').html('<p>\u7ACB\u5373<br>\u62A2\u5238</p>');
												clearInterval(timer);
												timer = null;
											}
										}
										_min = Math.floor(t / 60 % 60);
										_sec = Math.floor(t % 60);
										_countDownTime = "00:" + (_min < 10 ? '0' + _min : _min) + ":" + (_sec < 10 ? '0' + _sec : _sec);
										$('.over').html('<p>\u8DDD\u5F00\u62A2<span>' + _countDownTime + '</span></p>');
									}, 1000);
								}
							}
						} else if (month >= 11 && day > 3 && day <= 9) {
							$('.ticketBox').hide();
							$('.overBox').show();
						} else if (month >= 11 && day > 9) {
							$('.ticketBox').hide();
							$('.overBox').show();
							layer.open({
								content: '活动已结束哦！',
								style: 'background-color: rgba(0,0,0,0.5); color:#fff;font-size: 18px;',
								time: 3
							});
						}
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
		}]);

		return FinLife;
	}();

	var finLife = new FinLife();
});