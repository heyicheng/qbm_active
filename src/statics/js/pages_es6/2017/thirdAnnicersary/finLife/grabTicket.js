define(function(require, exports, module) {
	require('jquery');
	let layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);

	let text = [
		"双11“周年庆”14：00生活券即将开抢，你的小手准备好了么！",
		"双11“周年庆”明日11：00生活券即将开抢，你的小手准备好了么！",
		"双11“周年庆”11：00生活券已抢光，14：00更多礼券等你抢！",
		"双11“周年庆”16：00生活券已抢光，明日11：00更多礼券等你抢！"
	];
	let time = {
		"1": [1509505200, 1509516000, 1509523200],
		"2": [1509591600, 1509602400, 1509609600],
		"3": [1509678000, 1509688800, 1509696000]
	};

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
			this.derive = getUrlParam('derive');
			this.loadText();
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
					let data = { 'Javascript Responds': 'Wee!' }
					responseCallback(data);
				});

				bridge.callHandler('goLoadPageHandler', { 'title': '限时抢券，精品相赠', 'href': '', 'icon': 2, 'backBtn': 0 }, function(responseData) {
					if (typeof responseData == "string") responseData = JSON.parse(responseData);
					if (responseData.result) console.log("BANNER进入加载成功");
				});
				//发送分享信息给APP
				let sendInfo = {
					'shareTitle': '【三周年庆典】理财生活圈限时抢券',
					'shareLink': `${webUrl}/view/2017/thirdAnnicersary/finLife/grabTicket.html?type=h5`,
					'shareIntro': '好券限时领，买就送好礼！',
					'shareIcon': pcCdnUrl+'/images/shareIcon/znq.png'
				};

				bridge.callHandler('goSendShareInfoHandler', sendInfo, function(response) {
					if (typeof response == "string") response = JSON.parse(response);
					if (response.result) console.log("分享信息发送成功");
				});

				//返回
				bridge.registerHandler('goBackBtnHandler', function(data, responseCallback) {
					// let finLife = (self.derive == 'finLife')?'finLife/' : '';
					// let backLink = webUrl + "/view/2017/thirdAnnicersary/"+ finLife +"index.html?interaction=1&userId=" + getUrlParam('userId');
					let backLink = webUrl + "/view/2017/thirdAnnicersary/index.html?interaction=1&userId=" + getUrlParam('userId');
					let responseData = { 'title': "三周年庆典", 'href': backLink, 'icon': 1, 'backBtn': 1 };
					// if(self.derive == 'finLife'){
					// 	responseData = { 'title': "惊喜三重奏，生活“购”畅快", 'href': backLink, 'icon': 2, 'backBtn': 1 };
					// }
					responseCallback(responseData);
					if (typeof data == "string") data = JSON.parse(data);
					if (data.result) location.href = backLink;
				});


				// 抢券
				$(document).on("click", '.grabText', function() {
					let backLink = `${webUrl}/view/2017/thirdAnnicersary/finLife/grabTicket.html`;
					let userId = self.userId;
					if (userId == '(null)' || userId == null || userId == undefined || userId == '') {
						bridge.callHandler('goLoginHandler', { 'href': backLink + '?interaction=1' }, function(responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
						return false;
					}
				});

				$(document).on('click', '#rules', function() {
					bridge.callHandler('goPageHandler', { 'title': '活动规则', 'icon': 0, 'backBtn': 0 }, function(responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) location.href = `${webUrl}/view/2017/thirdAnnicersary/finLife/grabTicketRules.html?interaction=1&derive=${self.derive}&userId=${self.userId}`;
					});
				});

				//跳转我的券包
				$("#ticketPackage").on("click", function() {
					let backLink = `${webUrl}/view/2017/thirdAnnicersary/finLife/grabTicket.html`;
					let userId = self.userId;
					if (userId == '(null)' || userId == null || userId == undefined) {
						bridge.callHandler('goLoginHandler', { 'href': backLink + '?interaction=1' }, function(responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
					} else {
						bridge.callHandler('goAppModule', { 'target': 'ticketPackage' }, function(responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
					}
				});
			});
			//E-APP交互相关
		}
		listen() {
			let self = this;
			if (self.type == "h5") {
				$(document).on('click', '#ticketPackage', function(event) {
					location.href = "https://www.qbm360.com/applink.html";
				});
				$(document).on('click', '.grab', function(event) {
					location.href = "https://www.qbm360.com/applink.html";
					return false;
				});

				$(document).on('click', '#rules', function() {
					location.href = `${webUrl}/view/2017/thirdAnnicersary/finLife/grabTicketRules.html?interaction=1&userId=${self.userId}`;
				});
			} else {
				$(document).on('click', '.grab', function() {
					if ($(this).hasClass('disabled')) {
						return false;
					}
					$(this).addClass('disabled');
					setTimeout(function() {
						$('.grab').removeClass('disabled');
					}, 500);
					let userId = self.userId;
					if (userId != '(null)' && userId != null && userId != undefined && userId != '') {
						let nid = $(this).data('nid');
						let huodongId = $(this).data('huodongid');
						self.grabTicket(nid, huodongId);
					}
				});
			}


		}
		grabTicket(nid, huodongId) {
			let self = this;
			$.ajax({
					url: webUrl + '/anniversary/receiveLifeVoucher.html',
					type: 'get',
					dataType: 'jsonp',
					data: {
						userId: self.userId,
						nid: nid,
						huodongId: huodongId
					},
				})
				.done(function(data) {
					console.log("success");
					layer.open({
						content: data.msg,
						skin: 'msg',
						time: 2, //2秒后自动关闭
						end: function() {

						}
					});

				})
				.fail(function(data) {
					layer.open({
						content: '服务器繁忙，请稍后再试',
						skin: 'msg',
						time: 2, //2秒后自动关闭
						end: function() {

						}
					});
				});
		}
		loadText() {
			$.ajax({
					url: webUrl + '/anniversary/horseRaceLamp.html',
					type: 'get',
					dataType: 'jsonp',
					data: {},
				})
				.done(function(data) {
					$('#marquee').text(data.msg);
					document.getElementById('marquee').start();
				})
				.fail(function() {
					console.log("error");
				});
		}
		loadPage() {
			$.ajax({
					url: webUrl + '/anniversary/lifeVoucherList.html',
					type: 'get',
					dataType: 'jsonp',
					data: { userId: self.userId },
				})
				.done(function(data) {
					console.log("success");
					if (data.result) {
						let ticketHtml = '';
						let currenTime = data.currenTime;
						let d = new Date(currenTime * 1000);
						let month = d.getMonth() + 1;
						let day = d.getDate();
						let hour = d.getHours();

						let ticketsList = data.dataList;

						for (let i = 0; i < ticketsList.length; i++) {
							if (month < 11) {
								ticketHtml += `<div class="_ticket">
										<div class="_content">
											<p><span>¥</span><span class="_money">${ticketsList[i].money}</span>周年庆生活券</p>
											<p>投资满<span>${ticketsList[i].accountLimit}</span>元，期限满<span>${Math.ceil(parseInt(ticketsList[i].timeLimit)/30)}</span>个月</p>
											<p>适用商品：所有商品</p>
											<p>有效期：2017.11.10 - 2017.11.12</p>
										</div>
										<div class="grabText" data-nid="${ticketsList[i].nid}">
											<p>敬请<br>期待</p>
										</div>
									</div>`;
							} else {
								if (ticketsList[i].num == 0) {
									ticketHtml += `<div class="_ticket">
											<div class="_content">
												<p><span>¥</span><span class="_money">${ticketsList[i].money}</span>周年庆生活券</p>
												<p>投资满<span>${ticketsList[i].accountLimit}</span>元，期限满<span>${Math.ceil(parseInt(ticketsList[i].timeLimit)/30)}</span>个月</p>
												<p>适用商品：所有商品</p>
												<p>有效期：2017.11.10 - 2017.11.12</p>
											</div>
											<div class="grabText over" data-huodongId="${ticketsList[i].huodongid}" data-nid="${ticketsList[i].nid}">
												<p>已抢光</p>
											</div>
										</div>`;
								} else {
									ticketHtml += `<div class="_ticket">
											<div class="_content">
												<p><span>¥</span><span class="_money">${ticketsList[i].money}</span>周年庆生活券</p>
												<p>投资满<span>${ticketsList[i].accountLimit}</span>元，期限满<span>${Math.ceil(parseInt(ticketsList[i].timeLimit)/30)}</span>个月</p>
												<p>适用商品：所有商品</p>
												<p>有效期：2017.11.10 - 2017.11.12</p>
											</div>
											<div class="grabText grab" data-huodongid="${ticketsList[i].huodongid}" data-nid="${ticketsList[i].nid}">
												<p>立即<br>抢券</p>
											</div>
										</div>`;
								}

							}
						}

						$('.tickets').html(ticketHtml);

						let t = null;
						let timer = null
						if (month >= 11 && day >= 1 && day < 4) {
							if (hour < 11) {
								$('.grabText').addClass('time').removeClass('grab');
								t = time[day][0] - currenTime;
								let hours = Math.floor(t / 60 / 60 % 60);
								let min = Math.floor(t / 60 % 60);
								let sec = Math.floor(t % 60);
								let countDownTime = ((hours < 10) ? ('0' + hours) : hours) + ":" + ((min < 10) ? ('0' + min) : min) + ":" + ((sec < 10) ? ('0' + sec) : sec);

								$('.grabText').html(`<p>距开抢<span>${countDownTime}</span></p>`);

								timer = setInterval(function() {
									t -= 1;
									if (t == 0) {
										$('.grabText').addClass('grab').removeClass('time');
										$('.grabText').html(`<p>立即<br>抢券</p>`);
										clearInterval(timer);
										timer = null;
									}
									hours = Math.floor(t / 60 / 60 % 60);
									min = Math.floor(t / 60 % 60);
									sec = Math.floor(t % 60);
									countDownTime = ((hours < 10) ? ('0' + hours) : hours) + ":" + ((min < 10) ? ('0' + min) : min) + ":" + ((sec < 10) ? ('0' + sec) : sec);

									$('.grabText').html(`<p>距开抢<span>${countDownTime}</span></p>`);

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
									$('#marquee').text(`“周年庆” ${hour + 1}:00 生活券即将开抢，你的小手准备好了么！`);
									document.getElementById('marquee').start();

									let min = Math.floor(t / 60 % 60);
									let sec = Math.floor(t % 60);
									let countDownTime = "00:" + ((min < 10) ? ('0' + min) : min) + ":" + ((sec < 10) ? ('0' + sec) : sec);

									$('.over').html(`<p>距开抢<span>${countDownTime}</span></p>`);

									timer = setInterval(function() {
										t -= 1;
										if (t == 0) {
											if (t == 0) {
												$('.grabText').addClass('grab').removeClass('time').removeClass('over');
												$('.grabText').html(`<p>立即<br>抢券</p>`);
												clearInterval(timer);
												timer = null;
											}
										}
										min = Math.floor(t / 60 % 60);
										sec = Math.floor(t % 60);
										countDownTime = "00:" + ((min < 10) ? ('0' + min) : min) + ":" + ((sec < 10) ? ('0' + sec) : sec);
										$('.over').html(`<p>距开抢<span>${countDownTime}</span></p>`);
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

				})
				.fail(function() {
					console.log("error");
				});
		}
	}
	let finLife = new FinLife();
});