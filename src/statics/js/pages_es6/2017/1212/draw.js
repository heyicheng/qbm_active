define(function(require, exports, module) {
	require('jquery');
	let layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);
	let awards = [{
			lotteryId: '2',
			imgUrl: '', //L5
			name: '下次再来'
		},
		{
			lotteryId: '1',
			imgUrl: 'iPhone',
			name: 'iphone8 256G'
		},
		{
			lotteryId: '9',
			imgUrl: 'dw',
			name: 'DW女表'
		},
		{
			lotteryId: '6',
			imgUrl: 'iris',
			name: 'IRIS空气净化器'
		},
		{
			lotteryId: '4',
			imgUrl: 'nars',
			name: 'NARS 丝绒哑光唇膏'
		},
		{
			lotteryId: '7',
			imgUrl: 'xiaomi',
			name: '小米手环2'
		},
		{
			lotteryId: '10',
			imgUrl: '10',
			name: '10元红包'
		},
		{
			lotteryId: '5',
			imgUrl: '5', //L8
			name: '5元红包'
		},
		{
			lotteryId: '8',
			imgUrl: '50',
			name: '50元生活券'
		},
		{
			lotteryId: '3',
			imgUrl: '30', //L2
			name: '30元生活券'
		},
	];


	class FinLife {
		constructor() {
			this.init = ::this.init;
			this.listen = ::this.listen;
			this.roll = ::this.roll;
			this.lottery = ::this.lottery;
			this.init();
			this.listen();
		}
		init() {
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
				init: function(id) {
					if ($("#" + id).find(".luck-unit").length > 0) {
						let $luck = $("#" + id);
						let $units = $luck.find(".luck-unit");
						this.obj = $luck;
						this.count = $units.length;
						$luck.find(".award_1").addClass("active");
					};
				},
				roll: function() {
					let index = this.index;
					let count = this.count;
					let luck = this.obj;
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
				stop: function(index) {
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
					'title': '幸运大抽奖',
					'href': '',
					'icon': 0,
					'backBtn': self.type == 'index' ? 1 : 0
				}, function(responseData) {
					if (typeof responseData == "string") responseData = JSON.parse(responseData);
					if (responseData.result) console.log("BANNER进入加载成功");
				});

				// 跳转页面
				$(document).on('click', '.prizes', function() {
					let backLink = `${webUrl}/view/2017/1212/draw.html`;
					let userId = self.userId;
					if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
						bridge.callHandler('goLoginHandler', {
							'href': backLink + '?interaction=1'
						}, function(responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
						return false;
					} else {
						bridge.callHandler('goPageHandler', {
							'title': '我的奖品',
							'icon': 0,
							'backBtn': 0
						}, function(responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) location.href = `${webUrl}/view/2017/1212/prize.html?interaction=1&userId=${self.userId}`;
						});
					}
				});

				$(document).on('click', '.touzi span[type="1"]', function(event) {
					bridge.callHandler('goAppModule', { 'target': 'zeroBuy' }, function(responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) console.log("success");
					});
				});


				//登录
				$(document).on("click", '._lotteryBtn', function() {
					let backLink = `${webUrl}/view/2017/1212/draw.html`;
					let userId = self.userId;
					if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
						bridge.callHandler('goLoginHandler', {
							'href': backLink + '?interaction=1'
						}, function(responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
					} else {

					}
				})
				// 返回
				if (self.type != 'index') {
					bridge.registerHandler('goBackBtnHandler', function(data, responseCallback) {
						let backLink = `${webUrl}/view/2017/1212/index.html?interaction=1&userId=${self.userId}`;
						let responseData = {
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
		listen() {
			let self = this;
			if (self.type == "h5") {
				$(document).on('click', '.prizes', function() {
					location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.qianbaomu.view";
				});
			}
			//抽奖
			$(document).on('click', ".lotteryBtn", function() {
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
				let userId = self.userId;
				if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
					return false;
				}
				if (self.dou < 1) {
					layer.open({
						className: 'touzi',
						content: `<div><div style='margin-bottom: 0.2rem;'>次数不足哦~</div><p style='font-size: 14px;'>购买理财生活圈可获得更多抽奖次数！</p></div>`,
						style: 'font-size: 18px;',
						btn: ['立即购买', '遗憾离开'],
						yes: function() {
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
		getTime() {
			$.ajax({
					url: webUrl + '/anniversary/lotteryTime.html',
					type: 'get',
					dataType: 'jsonp',
					data: {},
				})
				.done(function(data) {
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
				})
				.fail(function() {
					console.log("error");
				});
		}
		roll() {
			let self = this;
			self.luck.times += 1;
			self.luck.roll();
			if (self.luck.times > self.luck.cycle + 10 && self.luck.prize == self.luck.index) {
				clearTimeout(self.luck.timer);
				setTimeout(function() {
					if (self.luck.prize == '2') {
						layer.open({
							className: 'successPop fail',
							content: `<div class="awardBox">
								<img class='icon' src="/statics/img/pages/2017/1212/failIcon.png" alt="" />
								<div class="title">很遗憾！您未中奖~</div>
								<p>与奖品擦肩而过<br />继续努力抽大奖吧！</p>
							</div>`,
							btn: ['确 定'],
							end: function() {
								self.luck.index = 0;
								self.luck.prize = -1;
								self.luck.times = 0;
								self.click = false;
							}
						});
						return false;
					}
					for (let i = 0; i < self.luck.count; i++) {
						if (awards[i]['lotteryId'] == self.luck.prize) {
							layer.open({
								className: 'successPop',
								content: `<div class="awardBox">
								<img class='icon' src="/statics/img/pages/2017/1212/successIcon.png" alt="" />
								<div class="title">恭喜您！</div>
								<p>获得 ${awards[i]['name']}</p>
								<div class='_imgBox ${awards[i]['imgUrl']}'><img src="/statics/img/pages/2017/1212/award_${awards[i]['imgUrl']}.png" alt="" /></div>
							</div>`,
								btn: ['确 定'],
								end: function() {
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
					if (self.luck.times > self.luck.cycle + 10 && ((self.luck.prize == 0 && self.luck.index == 7))) {
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
		lottery() {
			let self = this;
			self.click = true;
			$.ajax({
					url: webUrl + '/beans/lotteryActivity.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					},
				})
				.done(function(data) {
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
							end: function() {
								self.click = false;
							}
						});
					}

				})
				.fail(function() {
					console.log("error");
					self.click = false;
				});

		}
		loadPage() {
			let self = this;
			let userId = self.userId;
			if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
				return false;
			}
			$.ajax({
					url: webUrl + '/beans/lotteryNumber.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					},
				})
				.done(function(data) {
					if (!data.result) {
						layer.open({
							type: 1,
							content: data.msg,
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
						return false;
					}
					$('.myDou p').text(data.count);
					self.dou = data.count;
				})
				.fail(function() {
					console.log("error");
				});
		}
	}
	let finLife = new FinLife();
});