define(function(require, exports, module) {
	require('jquery');
	let layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);
	let html1 = `<div class="contentbox">
					<div class="_title" style="margin-bottom: 0.56rem">恭喜您，成功领取返现券！</div>
					<img class="icon2" src="/statics/img/pages/2017/brandZeroBuy/icon2.png" alt="" />
					<div class="_text">
						活动期间首次购买理财生活圈商品，将获<br>
						得首笔购买金额 * 1% 返现红包。
					</div>
					<button id="goAppFinancing" style="margin-top: 0.4rem;">前往理财生活圈</button>
					<div class="close" onclick="layer.closeAll()"><img src="/statics/img/pages/2017/brandZeroBuy/close.png" alt="" /></div>
				</div>`;
	let html2 = `<div class="contentbox">
					<div class="_title" style="margin-bottom: 0.36rem">恭喜您，注册成功！</div>
					<img class="icon1" src="/statics/img/pages/2017/brandZeroBuy/icon1.png" alt="" />
					<div class="_text">
						获得888元新手红包和理财生活圈返现券。<br>
						活动期间首次购买理财生活圈商品，将获<br>
						得首笔购买金额 * 1% 返现红包。
					</div>
					<button id="goAppFinancing" style="margin-top: 0.3rem;">前往理财生活圈</button>
					<div class="close" onclick="layer.closeAll()"><img src="/statics/img/pages/2017/brandZeroBuy/close.png" alt="" /></div>
				</div>`;

	let phoneTest = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
	let wait = 60;
	function time() {
		0 == wait ? ($("#getCode").text("重发验证码").attr("disabled", !1).css("color", "#ff87b6"),
			wait = 60) : ($("#getCode").text(wait + "秒后重试").attr("disabled", !0).css("color", "#ff87b6"),
			wait--,
			setTimeout(function() {
				time();
			}, 1000));
	}
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}
	class BrandZeroBuy {
		constructor() {
			this.init = ::this.init;
			this.listen = ::this.listen;
			this.init();
			this.listen();
		}
		init() {
			this.userId = getUrlParam('userId');
			this.type = getUrlParam('type');
		}
		
		listen() {
			let self = this;
			$('#btn').on('click', function() {
				self.openPopup();
			});

			$(document).on('click', '#vcode', function() {
				let img = $("#vcode"),
					imgUrl = img.attr("src").split("?")[0],
					imgPath = imgUrl + "?" + Math.random();
				img.attr("src", imgPath);
			});

			$(document).on("click", "#getCode", function() {
				self.getCode();
			});

			$(document).on("click", "#register", function() {
				self.register();
			});

			$(document).on("click", "#goAppFinancing",function(){
				location.href = "https://www.qbm360.com/applink.html";
			});
		}
		openPopup() {
			let phone = $('#phone').val();
			if (!phone || !(phoneTest.test(phone))) {
				layer.open({

					content: "请输入正确的手机号",
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			let phoneSystem = ""; //手机系统

			//判断手机系统
			if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
				phoneSystem = "ios";
			} else if (/(Android)/i.test(navigator.userAgent)) {
				phoneSystem = "Android";
			} else {
				phoneSystem = "other";
			}

			let regHtml = `<div class="regbox">
						<div class="_title">请先完成注册</div>
						<div class="_tip">新用户注册更享<span>888</span>元新手红包</div>
						<input type="hidden" value="zeroBuy" name="fromType" id="fromType" />
					    <input type="hidden" value="${phoneSystem}" name="fromSource" id="fromSource" />
					    <input type="hidden" value="1" id="type" name="type">
						<div class="inputbox"><input type="tel" id="phone2" name="phone" value="${phone}"  /></div>
						<div class="inputbox inputbox2">
							<input type="tel" id="imgCode" maxlength="4" placeholder="输入图像验证码" name="verificationCode" />
							<span><img id="vcode" src="${pcUrl}/pcrimg.html" alt="" /></span>
						</div>
						<div class="inputbox inputbox2">
							<input type="tel" maxlength="6" placeholder="请输入短信验证码" id="verificationCode" name="verificationPhone" />
							<span id="getCode">获取验证码</span>
						</div>
						<div class="inputbox"><input type="password" maxlength="16" placeholder="登录密码（6-16位字母和数字组合）" id="password" name="password" /></div>
						<div class="regProtocol">
							<input type="checkbox" name="agree" checked="">&nbsp;<span>我已阅读并同意<a href="https://www.qbm360.com/apiurl/activity/2017/jiaribao/reg-protocol.html">《钱保姆注册协议》</a></span>
						</div>
						<button id="register" style="margin-top: 0.3rem;">立即注册</button>
						<div class="close" onclick="layer.closeAll()"><img src="/statics/img/pages/2017/brandZeroBuy/close.png" alt="" /></div>
					</div>`;
			$.ajax({
				url: `${webUrl}/activity/zero/receiveTicket.html`,
				type: 'GET',
				dataType: 'jsonp',
				data: {
					phone: phone
				},
				success: function(data) {
					switch (data.code) {
						case 1:
							layer.open({
								content: html1,
							});
							break;
						case -2:
							layer.open({
								type: 1,
								content: data.msg,
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
							break;
						case -3:
							layer.open({
								content: regHtml,
							});
							break;
						default:
							break;
					}

				},
				error: function() {
					layer.open({
						type: 1,
						content: "网络请求失败，请稍后再试！",
						skin: 'msg',
						time: 2
					});
				}
			});

		}
		getCode() {
			let phone = $('#phone2').val(),
				imgCode = $("#imgCode").val();
			if (!phone || !(phoneTest.test(phone))) {
				layer.open({
					type: 1,
					content: "请输入正确的手机号",
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			if (!imgCode) {
				layer.open({
					type: 1,
					content: "请输入图形验证码",
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			$.ajax({
				url: `${pcUrl}/api/GetPhoneRegCode.html`,
				type: "get",
				dataType: "jsonp",
				jsonp: "callback",
				jsonpCallback: "jsonpCallback",
				data: {
					Phone: phone,
					verify: imgCode
				},
				success: function(data) {
					"string" == typeof data && (data = $.parseJSON(data)),
						data.result ? (time(),
							layer.open({
								type: 1,
								content: "验证码已经发送，请注意查收！",
								skin: 'msg',
								time: 2
							})) : layer.open({
							type: 1,
							content: data.msg,
							skin: 'msg',
							time: 2,
						})
				},
				error: function() {
					layer.open({
						type: 1,
						content: "网络请求失败，请稍后再试！",
						skin: 'msg',
						time: 2
					});
				}
			});
		}
		register() {
			let phone = $('#phone2').val(),
				imgCode = $("#imgCode").val(),
				password = $("#password").val(),
				verificationCode = $("#verificationCode").val();
			if (!phone || !(phoneTest.test(phone))) {
				layer.open({
					type: 1,
					content: "请输入正确的手机号",
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			if (!imgCode) {
				layer.open({
					type: 1,
					content: "请输入图形验证码",
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			if (!verificationCode) {
				layer.open({
					type: 1,
					content: "请输入短信验证码",
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			if (!password) {
				layer.open({
					type: 1,
					content: "请输入登录密码",
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			if (password.length < 6 || !(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,16})$/.test(password))) {
				layer.open({
					type: 1,
					content: "登录密码是6-16位数字与字母组合",
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			$.ajax({
				url: `${pcUrl}/api/regs2.html`,
				type: "post",
				dataType: "jsonp",
				data: {
					fromType: $("#fromType").val(),
					fromSource: $("#fromSource").val(),
					type: $("#type").val(),
					username: phone,
					verify: imgCode,
					password: password,
					VerificationCode: verificationCode
				},
				success: function(data) {
					if (typeof data == "string") {
						data = $.parseJSON(data);
					}
					if (data.result) {
						$.ajax({
							url: webUrl + "/activity/zero/receiveTicket.html",
							type: "get",
							dataType: "jsonp",
							data: {
								phone: phone
							},
							success: function(data) {
								if (data.code == 1) {
									layer.open({
										content: html2
									});
								}else {
									layer.open({
										type: 1,
										content: data.msg,
										skin: 'msg',
										time: 2 //2秒后自动关闭
									});
								}
							},
							error: function() {
								layer.open({
									type: 1,
									content: "网络请求失败，请稍后再试！",
									skin: 'msg',
									time: 2
								});
							}
						});
					} else {
						layer.open({
							type: 1,
							content: data.msg,
							skin: 'msg',
							time: 2,
							end: function() {
								$("#phone2").focus();
							}
						});
					}
				},
				error: function() {
					layer.open({
						type: 1,
						content: "网络请求失败，请稍后再试！",
						skin: 'msg',
						time: 2
					});
				}
			});
		}
	}
	let brandZeroBuy = new BrandZeroBuy();
});