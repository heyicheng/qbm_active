'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
	require('jquery');
	var layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);
	var awards = [{
		lotteryId: '2',
		imgUrl: '', //L5
		name: '下次再来'
	}, {
		lotteryId: '1',
		imgUrl: 'iPhone',
		name: 'iphone8 256G'
	}, {
		lotteryId: '9',
		imgUrl: 'dw',
		name: 'DW女表'
	}, {
		lotteryId: '6',
		imgUrl: 'iris',
		name: 'IRIS空气净化器'
	}, {
		lotteryId: '4',
		imgUrl: 'nars',
		name: 'NARS 丝绒哑光唇膏'
	}, {
		lotteryId: '7',
		imgUrl: 'xiaomi',
		name: '小米手环2'
	}, {
		lotteryId: '10',
		imgUrl: '10',
		name: '10元红包'
	}, {
		lotteryId: '5',
		imgUrl: '5', //L8
		name: '5元红包'
	}, {
		lotteryId: '8',
		imgUrl: '50',
		name: '50元生活券'
	}, {
		lotteryId: '3',
		imgUrl: '30', //L2
		name: '30元生活券'
	}];

	var FinLife = function () {
		function FinLife() {
			_classCallCheck(this, FinLife);

			this.init = this.init.bind(this);
			this.listen = this.listen.bind(this);
			this.roll = this.roll.bind(this);
			this.lottery = this.lottery.bind(this);
			this.init();
			this.listen();
		}

		_createClass(FinLife, [{
			key: 'init',
			value: function init() {
				this.userId = getUrlParam('userId');
				this.type = getUrlParam('type');
				this.getTime();
				this.luck = {
					index: 0, //当前转动到哪个位置，起点位置
					count: 0, //总共有多少个位置
					timer: 0, //setTimeout的ID，用clearTimeout清除
					speed: 20, //初始转动速度
					times: 0, //转动次数
					cycle: 20, //转动基本次数：即至少需要转动多少次再进入抽奖环节
					prize: -1, //中奖位置
					init: function init(id) {
						if ($("#" + id).find(".luck-unit").length > 0) {
							var $luck = $("#" + id);
							var $units = $luck.find(".luck-unit");
							this.obj = $luck;
							this.count = $units.length;
							$luck.find(".award_1").addClass("active");
						};
					},
					roll: function roll() {
						var index = this.index;
						var count = this.count;
						var luck = this.obj;
						console.log(index);
						$(luck).find(".luck-unit").removeClass("active");
						index += 1;
						if (index > count) {
							index = 0;
						};
						$(luck).find(".award_" + index).addClass("active");
						this.index = index;
						return false;
					},
					stop: function stop(index) {
						this.prize = index;
						return false;
					}
				};

				this.click = false;
				this.dou = 0;
				this.loadPage();
				this.luck.init('lottery');
				if (this.type != 'h5') {
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
						var data = {
							'Javascript Responds': 'Wee!'
						};
						responseCallback(data);
					});

					bridge.callHandler('goLoadPageHandler', {
						'title': '幸运大抽奖',
						'href': '',
						'icon': 0,
						'backBtn': self.type == 'index' ? 1 : 0
					}, function (responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) console.log("BANNER进入加载成功");
					});

					// 跳转页面
					$(document).on('click', '.prizes', function () {
						var backLink = webUrl + '/view/2017/1212/draw.html';
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
								if (responseData.result) location.href = webUrl + '/view/2017/1212/prize.html?interaction=1&userId=' + self.userId;
							});
						}
					});

					$(document).on('click', '.touzi span[type="1"]', function (event) {
						bridge.callHandler('goAppModule', { 'target': 'zeroBuy' }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
					});

					//登录
					$(document).on("click", '._lotteryBtn', function () {
						var backLink = webUrl + '/view/2017/1212/draw.html';
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
					// 返回
					if (self.type != 'index') {
						bridge.registerHandler('goBackBtnHandler', function (data, responseCallback) {
							var backLink = webUrl + '/view/2017/1212/index.html?interaction=1&userId=' + self.userId;
							var responseData = {
								'title': "钱保姆理财",
								'href': backLink,
								'icon': 1,
								'backBtn': 1
							};
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
				if (self.type == "h5") {
					$(document).on('click', '.prizes', function () {
						location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.qianbaomu.view";
					});
				}
				//抽奖
				$(document).on('click', ".lotteryBtn", function () {
					if (self.click) {
						return false;
					}
					if ($(this).hasClass('end') || $(this).hasClass('nostart')) {
						return false;
					}
					if (self.type == 'h5') {
						location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.qianbaomu.view";
						return false;
					}
					var userId = self.userId;
					if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
						return false;
					}
					if (self.dou < 1) {
						layer.open({
							className: 'touzi',
							content: '<div><div style=\'margin-bottom: 0.2rem;\'>\u6B21\u6570\u4E0D\u8DB3\u54E6~</div><p style=\'font-size: 14px;\'>\u8D2D\u4E70\u7406\u8D22\u751F\u6D3B\u5708\u53EF\u83B7\u5F97\u66F4\u591A\u62BD\u5956\u6B21\u6570\uFF01</p></div>',
							style: 'font-size: 18px;',
							btn: ['立即购买', '遗憾离开'],
							yes: function yes() {
								layer.closeAll();
							}
						});
						return false;
					}

					if (self.click) {
						return false;
					} else {
						self.lottery();
						return false;
					}
				});
			}
		}, {
			key: 'getTime',
			value: function getTime() {
				$.ajax({
					url: webUrl + '/anniversary/lotteryTime.html',
					type: 'get',
					dataType: 'jsonp',
					data: {}
				}).done(function (data) {
					if (data.status == 2) {
						layer.open({
							content: '活动已结束哦！',
							style: 'background-color: rgba(0,0,0,0.5); color:#fff;font-size: 18px;',
							time: 3
						});
						$('.lotteryBtn').addClass('end');
						return false;
					} else if (data.status == 3) {
						$('.lotteryBtn').addClass('nostart');
						layer.open({
							content: '活动未开始',
							style: 'background-color: rgba(0,0,0,0.5); color:#fff;font-size: 18px;',
							time: 3
						});
						return false;
					}
				}).fail(function () {
					console.log("error");
				});
			}
		}, {
			key: 'roll',
			value: function roll() {
				var self = this;
				self.luck.times += 1;
				self.luck.roll();
				if (self.luck.times > self.luck.cycle + 10 && self.luck.prize == self.luck.index) {
					clearTimeout(self.luck.timer);
					setTimeout(function () {
						if (self.luck.prize == '2') {
							layer.open({
								className: 'successPop fail',
								content: '<div class="awardBox">\n\t\t\t\t\t\t\t\t<img class=\'icon\' src="/statics/img/pages/2017/1212/failIcon.png" alt="" />\n\t\t\t\t\t\t\t\t<div class="title">\u5F88\u9057\u61BE\uFF01\u60A8\u672A\u4E2D\u5956~</div>\n\t\t\t\t\t\t\t\t<p>\u4E0E\u5956\u54C1\u64E6\u80A9\u800C\u8FC7<br />\u7EE7\u7EED\u52AA\u529B\u62BD\u5927\u5956\u5427\uFF01</p>\n\t\t\t\t\t\t\t</div>',
								btn: ['确 定'],
								end: function end() {
									self.luck.index = 0;
									self.luck.prize = -1;
									self.luck.times = 0;
									self.click = false;
								}
							});
							return false;
						}
						for (var i = 0; i < self.luck.count; i++) {
							if (awards[i]['lotteryId'] == self.luck.prize) {
								layer.open({
									className: 'successPop',
									content: '<div class="awardBox">\n\t\t\t\t\t\t\t\t<img class=\'icon\' src="/statics/img/pages/2017/1212/successIcon.png" alt="" />\n\t\t\t\t\t\t\t\t<div class="title">\u606D\u559C\u60A8\uFF01</div>\n\t\t\t\t\t\t\t\t<p>\u83B7\u5F97 ' + awards[i]['name'] + '</p>\n\t\t\t\t\t\t\t\t<div class=\'_imgBox ' + awards[i]['imgUrl'] + '\'><img src="/statics/img/pages/2017/1212/award_' + awards[i]['imgUrl'] + '.png" alt="" /></div>\n\t\t\t\t\t\t\t</div>',
									btn: ['确 定'],
									end: function end() {
										$('.myDou p').text(self.dou);
										self.luck.index = 0;
										self.luck.prize = -1;
										self.luck.times = 0;
										self.click = false;
									}
								});
							}
						}
					}, 300);
				} else {
					if (self.luck.times < self.luck.cycle) {
						self.luck.speed -= 5;
					} else {
						if (self.luck.times > self.luck.cycle + 10 && self.luck.prize == 0 && self.luck.index == 7) {
							self.luck.speed += 50;
						} else {
							self.luck.speed += 15;
						}
					}
					if (self.luck.speed < 120) {
						self.luck.speed = 120;
					};

					self.luck.timer = setTimeout(self.roll, self.luck.speed);
				}
				return false;
			}
		}, {
			key: 'lottery',
			value: function lottery() {
				var self = this;
				self.click = true;
				$.ajax({
					url: webUrl + '/beans/lotteryActivity.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					}
				}).done(function (data) {
					if (data.result) {
						$('.myDou p').text(self.dou - 1);
						self.dou = data.beansCount;
						self.luck.speed = 160;
						self.luck.prize = awards[data.level]['lotteryId'];
						self.roll();
						self.luck.index = 0;
					} else {
						layer.open({
							type: 1,
							content: data.msg,
							skin: 'msg',
							time: 2, //2秒后自动关闭
							end: function end() {
								self.click = false;
							}
						});
					}
				}).fail(function () {
					console.log("error");
					self.click = false;
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
					url: webUrl + '/beans/lotteryNumber.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					}
				}).done(function (data) {
					if (!data.result) {
						layer.open({
							type: 1,
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						return false;
					}
					$('.myDou p').text(data.count);
					self.dou = data.count;
				}).fail(function () {
					console.log("error");
				});
			}
		}]);

		return FinLife;
	}();

	var finLife = new FinLife();
});