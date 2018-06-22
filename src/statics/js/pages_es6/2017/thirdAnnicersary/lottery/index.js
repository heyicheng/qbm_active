define(function (require, exports, module) {
	require('jquery');
	let layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);
	let awards = [{
			lotteryId: '6',
			imgUrl: '', //L5
			name: '下次再来'
		},
		{
			lotteryId: '1',
			imgUrl: 'iPhone', //L1
			name: 'iPhoneX 256G'
		},
		{
			lotteryId: '9',
			imgUrl: 'iWatch', //L7
			name: 'Apple Watch Series 3'
		},
		{
			lotteryId: '7',
			imgUrl: 'saodi', //L9
			name: '扫地机器人'
		},
		{
			lotteryId: '5',
			imgUrl: 'kindle', //L6
			name: '亚马逊KindleX'
		},
		{
			lotteryId: '4',
			imgUrl: 'jiashi', //L4
			name: '加湿器'
		},
		{
			lotteryId: '3',
			imgUrl: '50', //L3
			name: '50元理财生活圈抵用券'
		},
		{
			lotteryId: '100',
			imgUrl: '30',
			name: '30元无门槛红包'
		},
		{
			lotteryId: '8',
			imgUrl: '5', //L8
			name: '5元无门槛红包'
		},
		{
			lotteryId: '2',
			imgUrl: 'dou_3', //L2
			name: '3个钱豆'
		},
		{
			lotteryId: '10',
			imgUrl: 'dou_1', //L5
			name: '1个钱豆'
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
				cycle: 30, //转动基本次数：即至少需要转动多少次再进入抽奖环节
				prize: -1, //中奖位置
				init: function (id) {
					if ($("#" + id).find(".luck-unit").length > 0) {
						let $luck = $("#" + id);
						let $units = $luck.find(".luck-unit");
						this.obj = $luck;
						this.count = $units.length;
						$luck.find(".award_1").addClass("active");
					};
				},
				roll: function () {
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
				stop: function (index) {
					this.prize = index;
					return false;
				}
			};

			this.click = false;
			this.dou = 0;
			this.loadPage();
			this.luck.init('lottery');
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
					document.addEventListener('WebViewJavascriptBridgeReady', function () {
						callback(WebViewJavascriptBridge);
					}, false)
				}
			}
			connectWebViewJavascriptBridge(function (bridge) {

				//加载页面后调用
				bridge.init(function (message, responseCallback) {
					let data = {
						'Javascript Responds': 'Wee!'
					}
					responseCallback(data);
				});

				bridge.callHandler('goLoadPageHandler', {
					'title': '抽兑iPhone随心意',
					'href': '',
					'icon': 2,
					'backBtn': 0
				}, function (responseData) {
					if (typeof responseData == "string") responseData = JSON.parse(responseData);
					if (responseData.result) console.log("BANNER进入加载成功");
				});
				//发送分享信息给APP
				let sendInfo = {
					'shareTitle': '【三周年庆典】抽兑大奖随心意',
					'shareLink': `${webUrl}/view/2017/thirdAnnicersary/lottery/index.html?type=h5`,
					'shareIntro': 'iPhone X、Apple Watch 3、扫地机器人随心抽兑！',
					'shareIcon': pcCdnUrl + '/images/shareIcon/znq.png'
				};

				bridge.callHandler('goSendShareInfoHandler', sendInfo, function (response) {
					if (typeof response == "string") response = JSON.parse(response);
					if (response.result) console.log("分享信息发送成功");
				});
				//自定义分享成功回调
				bridge.registerHandler('goShareStateHandler', function (data, responseCallback) {
					//alert("自定义分享成功回调");
					if (typeof data == "string") data = JSON.parse(data);
					if (data.result) {
						console.log(data.place);
						if (data.place == 2) {
							$.ajax({
									url: webUrl + '/beans/share.html',
									type: 'get',
									dataType: 'jsonp',
									data: {
										userId: self.userId
									},
								})
								.done(function (data) {
									if (data.result) {
										$('.myDou p span').text(data.beansCount);
										self.dou = data.beansCount;
										layer.open({
											className: 'successPop',
											content: `<div class="awardBox">
													<img class='icon' src="/statics/img/pages/2017/thirdAnnicersary/lottery/successIcon.png" alt="" />
													<div class="title">分享成功！</div>
													<p>恭喜获得5钱豆</p>
													<div class='_imgBox'><img src="/statics/img/pages/2017/thirdAnnicersary/lottery/award_dou_5.png" alt="" /></div>
												</div>`,
											btn: ['确认']
										});
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
					}
				})

				// 跳转页面
				$(document).on('click', '.rules', function () {
					bridge.callHandler('goPageHandler', {
						'title': '活动规则',
						'icon': 0,
						'backBtn': 0
					}, function (responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) location.href = `${webUrl}/view/2017/thirdAnnicersary/lottery/rules.html?interaction=1&userId=${self.userId}`;
					});
				});

				$(document).on('click', '.prizes', function () {
					let backLink = `${webUrl}/view/2017/thirdAnnicersary/lottery/index.html`;
					let userId = self.userId;
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
							if (responseData.result) location.href = `${webUrl}/view/2017/thirdAnnicersary/lottery/prize.html?interaction=1&userId=${self.userId}`;
						});
					}
				});

				$(document).on('click', '.backMain', function () {
					bridge.callHandler('goPageHandler', {
						'title': '三周年庆典',
						'icon': 1,
						'backBtn': 1
					}, function (responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) location.href = webUrl + "/view/2017/thirdAnnicersary/index.html?interaction=1&userId=" + self.userId;
					});
				});

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
					let backLink = `${webUrl}/view/2017/thirdAnnicersary/lottery/index.html`;
					let userId = self.userId;
					if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
						bridge.callHandler('goLoginHandler', {
							'href': backLink + '?interaction=1'
						}, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
					} else {

					}
				})
				// 返回
				bridge.registerHandler('goBackBtnHandler', function (data, responseCallback) {
					let backLink = `${webUrl}/view/2017/thirdAnnicersary/index.html?interaction=1&userId=${self.userId}`;
					let responseData = {
						'title': "三周年庆典",
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
			if (self.type == "h5") {
				$(document).on('click', '.rules', function () {
					location.href = `/view/2017/thirdAnnicersary/lottery/rules.html?type=h5`;
				});

				$(document).on('click', '.prizes', function () {
					location.href = "https://www.qbm360.com/applink.html";
				});

				$(document).on('click', '.backMain', function () {
					location.href = `/view/2017/thirdAnnicersary/index.html?type=h5`;
				});
			}
			//抽奖
			$(document).on('click', ".lotteryBtn", function () {
				if(self.click){
					return false;
				}
				if ($(this).hasClass('disable')) {
					return false;
				}
				if (self.type == 'h5') {
					location.href = "https://www.qbm360.com/applink.html";
					return false;
				}
				let userId = self.userId;
				if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
					return false;
				}
				if (self.dou < 5) {
					layer.open({
						className: 'touzi',
						content: `<div><div style='margin-bottom: 0.2rem;'>钱豆不够哦~</div><p style='font-size: 14px;'>投资可获得更多钱豆！</p></div>`,
						style: 'font-size: 18px;',
						btn: ['立即投资', '遗憾离开'],
						yes: function () {
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

			$(document).on('click', '.exchangeBtn', function () {
				if (self.type == 'h5') {
					location.href = "https://www.qbm360.com/applink.html";
					return false;
				}
				let userId = self.userId;
				if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
					return false;
				}
				let oIndex = $(this).data('index');
				let num = $(this).data('num');
				if (self.dou < num) {
					layer.open({
						className: 'touzi',
						content: `<div><div style='margin-bottom: 0.2rem;'>钱豆不够哦~</div><p style='font-size: 14px;'>投资可获得更多钱豆！</p></div>`,
						style: 'font-size: 18px;',
						btn: ['立即投资', '遗憾离开'],
						yes: function () {
							layer.closeAll();
						}
					});
				} else {
					layer.open({
						content: `确定要兑换 ${awards[oIndex]['name']} 吗？`,
						style: 'font-size: 18px;',
						btn: ['立即兑换', '暂不兑换'],
						yes: function () {
							self.exchange(oIndex);
						}
					});
				}
			});

			$('.calculator').on('click', function (event) {
				event.preventDefault();
				/* Act on the event */
				self.calculator();

			});

			$(document).on('click', '.label,input[type="radio"]', function (event) {
				/* Act on the event */
				if ($('#day').is(':checked')) {
					$('.limit span').text('天');
				} else {
					$('.limit span').text('月');
				}
			});
		}
		getTime() {
			$.ajax({
					url: pcUrl + '/hb/getCurrentTimeStamp.html',
					type: 'get',
					dataType: 'jsonp',
					data: {},
				})
				.done(function (data) {
					let currentTime = parseInt(data.currentTime);
					let d = new Date(currentTime * 1000);
					
					let month = d.getMonth() + 1;
					let day = d.getDate();
					if (month > 11) {
						$('.exchangeBtn').attr('disabled', true);
						layer.open({
							content: '活动已结束哦！',
							style: 'background-color: rgba(0,0,0,0.5); color:#fff;font-size: 18px;',
							time: 3
						});
						return false;
					} else if (day > 12 && day < 31) {
						$('.lotteryBtn').removeClass('disable');
						return false;
					} else if (day < 13) {
						$('.exchangeBtn').attr('disabled', true);
						layer.open({
							content: '活动未开始',
							style: 'background-color: rgba(0,0,0,0.5); color:#fff;font-size: 18px;',
							time: 3
						});
						return false;
					}
				})
				.fail(function () {
					console.log("error");
				});
		}
		roll() {
			let self = this;
			self.luck.times += 1;
			self.luck.roll();
			if (self.luck.times > self.luck.cycle + 10 && self.luck.prize == self.luck.index) {
				clearTimeout(self.luck.timer);
				setTimeout(function () {
					if (self.luck.prize == '6') {
						layer.open({
							className: 'successPop fail',
							content: `<div class="awardBox">
								<img class='icon' src="/statics/img/pages/2017/thirdAnnicersary/lottery/failIcon.png" alt="" />
								<div class="title">很遗憾！您未中奖~</div>
								<p>与奖品擦肩而过<br />继续努力抽大奖吧！</p>
							</div>`,
							btn: ['确认'],
							end: function () {
								self.luck.index = 0;
								self.luck.prize = -1;
								self.luck.times = 0;
								self.click = false;
							}
						});
						return false;
					}
					for (let i = 1; i < self.luck.count + 1; i++) {
						if (awards[i]['lotteryId'] == self.luck.prize) {
							layer.open({
								className: 'successPop',
								content: `<div class="awardBox">
								<img class='icon' src="/statics/img/pages/2017/thirdAnnicersary/lottery/successIcon.png" alt="" />
								<div class="title">恭喜您！</div>
								<p>获得 ${awards[i]['name']}</p>
								<div class='_imgBox ${awards[i]['imgUrl']}'><img src="/statics/img/pages/2017/thirdAnnicersary/lottery/award_${awards[i]['imgUrl']}.png" alt="" /></div>
							</div>`,
								btn: ['确认'],
								end: function () {
									$('.myDou p span').text(self.dou);
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
		calculator() {
			layer.open({
				className: 'calculatorPop',
				title: ['钱豆计算器', 'font-size: 0.36rem;border-bottom: 1px solid #e5e5e5'],
				content: `<div>
					<div class="finBox">
						<div class="item">
							<label for="">投资金额：</label><input type="number" id="account" /><span>元</span>
						</div>
						<div class="item">
							<label for="">期限选择：</label>
							<input type="radio" name='timeLimit' id='day' checked /><label class="label" for="day">天标</label>
							<input type="radio" name='timeLimit' id='month' /><label class="label" for="month">月标</label>
						</div>
						<div class="item limit">
							<label for="">投资期限：</label><input type="number" id="timeLimit" /><span>天</span>
						</div>
					</div>
					<div class="getDou">
						<label for="">可得到钱豆：</label>
						<span><i>0</i>颗</span>
					</div>
				</div>`,
				btn: ['计算'],
				yes: function () {
					let account = $('#account').val();
					let timeLimit = $('#timeLimit').val();
					let type = 1;
					if ($('#day').is(':checked')) {
						type = 1;
					} else {
						type = 2;
					}
					if (!timeLimit || !account) {
						return false;
					}
					$('.getDou span i').text(Math.floor((account * timeLimit) / (type == 1 ? 365 : 12) / 100 * 3));
				}
			});
		}
		lottery() {
			let self = this;
			self.click = true;
			$.ajax({
					url: webUrl + '/beans/lottery.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					},
				})
				.done(function (data) {
					if (data.result) {
						$('.myDou p span').text(self.dou - 5);
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
							end: function () {
								self.click = false;
							}
						});
					}

				})
				.fail(function () {
					console.log("error");
					self.click = false;
				});

		}
		exchange(index) {
			let self = this;
			$.ajax({
					url: webUrl + '/beans/exchange.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId,
						level: index
					},
				})
				.done(function (data) {
					if (data.result) {
						$('.myDou p span').text(data.beansCount);
						self.dou = data.beansCount;
						layer.open({
							className: 'successPop',
							content: `<div class="awardBox">
								<img class='icon' src="/statics/img/pages/2017/thirdAnnicersary/lottery/successIcon.png" alt="" />
								<div class="title">恭喜您！</div>
								<p>获得 ${awards[index]['name']}</p>
								<div class='_imgBox ${awards[index]['imgUrl']}'><img src="/statics/img/pages/2017/thirdAnnicersary/lottery/award_${awards[index]['imgUrl']}.png" alt="" /></div>
							</div>`,
							btn: ['确认']
						});
					} else {
						layer.closeAll();
						layer.open({
							type: 1,
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
		loadPage() {
			document.getElementById('marquee').stop();
			let self = this;
			$.ajax({
					url: webUrl + '/beans/getRewardList.html',
					type: 'get',
					dataType: 'jsonp',
					data: {},
				})
				.done(function (data) {
					if (data.result) {
						let list = data.data;
						let text = '';
						for (let i = 0; i < list.length; i++) {
							text += `${list[i].realname}${list[i].sex ? list[i].sex : ''} ${list[i].detail}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
							$('#marquee').html(text);
							document.getElementById('marquee').start();
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
				.fail(function () {
					console.log("error");
				});
			let userId = self.userId;
			if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
				return false;
			}
			$.ajax({
					url: webUrl + '/beans/getBeansCount.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId
					},
				})
				.done(function (data) {
					if (data.result) {
						$('.myDou p span').text(data.beansCount);
						self.dou = data.beansCount;
					} else {
						layer.open({
							type: 1,
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
	}
	let finLife = new FinLife();
});