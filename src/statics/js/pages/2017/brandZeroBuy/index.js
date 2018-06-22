'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
	require('jquery');
	var layer = require('layer');
	require('layerCss');
	require('fastclick');
	FastClick.attach(document.body);
	var html1 = '<div class="contentbox">\n\t\t\t\t\t<div class="_title" style="margin-bottom: 0.56rem">\u606D\u559C\u60A8\uFF0C\u6210\u529F\u9886\u53D6\u8FD4\u73B0\u5238\uFF01</div>\n\t\t\t\t\t<img class="icon2" src="/statics/img/pages/2017/brandZeroBuy/icon2.png" alt="" />\n\t\t\t\t\t<div class="_text">\n\t\t\t\t\t\t\u6D3B\u52A8\u671F\u95F4\u9996\u6B21\u8D2D\u4E70\u7406\u8D22\u751F\u6D3B\u5708\u5546\u54C1\uFF0C\u5C06\u83B7<br>\n\t\t\t\t\t\t\u5F97\u9996\u7B14\u8D2D\u4E70\u91D1\u989D * 1% \u8FD4\u73B0\u7EA2\u5305\u3002\n\t\t\t\t\t</div>\n\t\t\t\t\t<button id="goAppFinancing" style="margin-top: 0.4rem;">\u524D\u5F80\u7406\u8D22\u751F\u6D3B\u5708</button>\n\t\t\t\t\t<div class="close" onclick="layer.closeAll()"><img src="/statics/img/pages/2017/brandZeroBuy/close.png" alt="" /></div>\n\t\t\t\t</div>';
	var html2 = '<div class="contentbox">\n\t\t\t\t\t<div class="_title" style="margin-bottom: 0.36rem">\u606D\u559C\u60A8\uFF0C\u6CE8\u518C\u6210\u529F\uFF01</div>\n\t\t\t\t\t<img class="icon1" src="/statics/img/pages/2017/brandZeroBuy/icon1.png" alt="" />\n\t\t\t\t\t<div class="_text">\n\t\t\t\t\t\t\u83B7\u5F97888\u5143\u65B0\u624B\u7EA2\u5305\u548C\u7406\u8D22\u751F\u6D3B\u5708\u8FD4\u73B0\u5238\u3002<br>\n\t\t\t\t\t\t\u6D3B\u52A8\u671F\u95F4\u9996\u6B21\u8D2D\u4E70\u7406\u8D22\u751F\u6D3B\u5708\u5546\u54C1\uFF0C\u5C06\u83B7<br>\n\t\t\t\t\t\t\u5F97\u9996\u7B14\u8D2D\u4E70\u91D1\u989D * 1% \u8FD4\u73B0\u7EA2\u5305\u3002\n\t\t\t\t\t</div>\n\t\t\t\t\t<button id="goAppFinancing" style="margin-top: 0.3rem;">\u524D\u5F80\u7406\u8D22\u751F\u6D3B\u5708</button>\n\t\t\t\t\t<div class="close" onclick="layer.closeAll()"><img src="/statics/img/pages/2017/brandZeroBuy/close.png" alt="" /></div>\n\t\t\t\t</div>';

	var phoneTest = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
	var wait = 60;
	function time() {
		0 == wait ? ($("#getCode").text("重发验证码").attr("disabled", !1).css("color", "#ff87b6"), wait = 60) : ($("#getCode").text(wait + "秒后重试").attr("disabled", !0).css("color", "#ff87b6"), wait--, setTimeout(function () {
			time();
		}, 1000));
	}
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}

	var BrandZeroBuy = function () {
		function BrandZeroBuy() {
			_classCallCheck(this, BrandZeroBuy);

			this.init = this.init.bind(this);
			this.listen = this.listen.bind(this);
			this.init();
			this.listen();
		}

		_createClass(BrandZeroBuy, [{
			key: 'init',
			value: function init() {
				this.userId = getUrlParam('userId');
				this.type = getUrlParam('type');
			}
		}, {
			key: 'listen',
			value: function listen() {
				var self = this;
				$('#btn').on('click', function () {
					self.openPopup();
				});

				$(document).on('click', '#vcode', function () {
					var img = $("#vcode"),
					    imgUrl = img.attr("src").split("?")[0],
					    imgPath = imgUrl + "?" + Math.random();
					img.attr("src", imgPath);
				});

				$(document).on("click", "#getCode", function () {
					self.getCode();
				});

				$(document).on("click", "#register", function () {
					self.register();
				});

				$(document).on("click", "#goAppFinancing", function () {
					location.href = "https://www.qbm360.com/applink.html";
				});
			}
		}, {
			key: 'openPopup',
			value: function openPopup() {
				var phone = $('#phone').val();
				if (!phone || !phoneTest.test(phone)) {
					layer.open({

						content: "请输入正确的手机号",
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return false;
				}
				var phoneSystem = ""; //手机系统

				//判断手机系统
				if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
					phoneSystem = "ios";
				} else if (/(Android)/i.test(navigator.userAgent)) {
					phoneSystem = "Android";
				} else {
					phoneSystem = "other";
				}

				var regHtml = '<div class="regbox">\n\t\t\t\t\t\t<div class="_title">\u8BF7\u5148\u5B8C\u6210\u6CE8\u518C</div>\n\t\t\t\t\t\t<div class="_tip">\u65B0\u7528\u6237\u6CE8\u518C\u66F4\u4EAB<span>888</span>\u5143\u65B0\u624B\u7EA2\u5305</div>\n\t\t\t\t\t\t<input type="hidden" value="zeroBuy" name="fromType" id="fromType" />\n\t\t\t\t\t    <input type="hidden" value="' + phoneSystem + '" name="fromSource" id="fromSource" />\n\t\t\t\t\t    <input type="hidden" value="1" id="type" name="type">\n\t\t\t\t\t\t<div class="inputbox"><input type="tel" id="phone2" name="phone" value="' + phone + '"  /></div>\n\t\t\t\t\t\t<div class="inputbox inputbox2">\n\t\t\t\t\t\t\t<input type="tel" id="imgCode" maxlength="4" placeholder="\u8F93\u5165\u56FE\u50CF\u9A8C\u8BC1\u7801" name="verificationCode" />\n\t\t\t\t\t\t\t<span><img id="vcode" src="' + pcUrl + '/pcrimg.html" alt="" /></span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="inputbox inputbox2">\n\t\t\t\t\t\t\t<input type="tel" maxlength="6" placeholder="\u8BF7\u8F93\u5165\u77ED\u4FE1\u9A8C\u8BC1\u7801" id="verificationCode" name="verificationPhone" />\n\t\t\t\t\t\t\t<span id="getCode">\u83B7\u53D6\u9A8C\u8BC1\u7801</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="inputbox"><input type="password" maxlength="16" placeholder="\u767B\u5F55\u5BC6\u7801\uFF086-16\u4F4D\u5B57\u6BCD\u548C\u6570\u5B57\u7EC4\u5408\uFF09" id="password" name="password" /></div>\n\t\t\t\t\t\t<div class="regProtocol">\n\t\t\t\t\t\t\t<input type="checkbox" name="agree" checked="">&nbsp;<span>\u6211\u5DF2\u9605\u8BFB\u5E76\u540C\u610F<a href="https://www.qbm360.com/apiurl/activity/2017/jiaribao/reg-protocol.html">\u300A\u94B1\u4FDD\u59C6\u6CE8\u518C\u534F\u8BAE\u300B</a></span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button id="register" style="margin-top: 0.3rem;">\u7ACB\u5373\u6CE8\u518C</button>\n\t\t\t\t\t\t<div class="close" onclick="layer.closeAll()"><img src="/statics/img/pages/2017/brandZeroBuy/close.png" alt="" /></div>\n\t\t\t\t\t</div>';
				$.ajax({
					url: webUrl + '/activity/zero/receiveTicket.html',
					type: 'GET',
					dataType: 'jsonp',
					data: {
						phone: phone
					},
					success: function success(data) {
						switch (data.code) {
							case 1:
								layer.open({
									content: html1
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
									content: regHtml
								});
								break;
							default:
								break;
						}
					},
					error: function error() {
						layer.open({
							type: 1,
							content: "网络请求失败，请稍后再试！",
							skin: 'msg',
							time: 2
						});
					}
				});
			}
		}, {
			key: 'getCode',
			value: function getCode() {
				var phone = $('#phone2').val(),
				    imgCode = $("#imgCode").val();
				if (!phone || !phoneTest.test(phone)) {
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
					url: pcUrl + '/api/GetPhoneRegCode.html',
					type: "get",
					dataType: "jsonp",
					jsonp: "callback",
					jsonpCallback: "jsonpCallback",
					data: {
						Phone: phone,
						verify: imgCode
					},
					success: function success(data) {
						"string" == typeof data && (data = $.parseJSON(data)), data.result ? (time(), layer.open({
							type: 1,
							content: "验证码已经发送，请注意查收！",
							skin: 'msg',
							time: 2
						})) : layer.open({
							type: 1,
							content: data.msg,
							skin: 'msg',
							time: 2
						});
					},
					error: function error() {
						layer.open({
							type: 1,
							content: "网络请求失败，请稍后再试！",
							skin: 'msg',
							time: 2
						});
					}
				});
			}
		}, {
			key: 'register',
			value: function register() {
				var phone = $('#phone2').val(),
				    imgCode = $("#imgCode").val(),
				    password = $("#password").val(),
				    verificationCode = $("#verificationCode").val();
				if (!phone || !phoneTest.test(phone)) {
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
				if (password.length < 6 || !/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,16})$/.test(password)) {
					layer.open({
						type: 1,
						content: "登录密码是6-16位数字与字母组合",
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return false;
				}
				$.ajax({
					url: pcUrl + '/api/regs2.html',
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
					success: function success(data) {
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
								success: function success(data) {
									if (data.code == 1) {
										layer.open({
											content: html2
										});
									} else {
										layer.open({
											type: 1,
											content: data.msg,
											skin: 'msg',
											time: 2 //2秒后自动关闭
										});
									}
								},
								error: function error() {
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
								end: function end() {
									$("#phone2").focus();
								}
							});
						}
					},
					error: function error() {
						layer.open({
							type: 1,
							content: "网络请求失败，请稍后再试！",
							skin: 'msg',
							time: 2
						});
					}
				});
			}
		}]);

		return BrandZeroBuy;
	}();

	var brandZeroBuy = new BrandZeroBuy();
});