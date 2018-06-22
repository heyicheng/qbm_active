define(function(require, exports, module) {
	"use strict";
	require('zepto');
	require('fastclick');

	FastClick.attach(document.body);

	$(function() {
		//参数处理,获取用户id
		function getUrlParam(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		}

		var App = function() {

			this.url = {
				loginId: getUrlParam('userId'),
				nid: getUrlParam('nId'),
				from: getUrlParam('from')
			};
			this.init();
			this.getRule();
		};

		App.prototype = {
			init: function() {
				var self = this;
				var responseData = {};
				//S-APP交互相关
				function connectWebViewJavascriptBridge(callback) { //判断APP是否支持WebViewJavascriptBridge
					if (window.WebViewJavascriptBridge) {
						callback(WebViewJavascriptBridge)
					} else {
						document.addEventListener('WebViewJavascriptBridgeReady', function() {
							callback(WebViewJavascriptBridge)
						}, false)
					}
				}

				connectWebViewJavascriptBridge(function(bridge) {

					//加载页面后调用
					bridge.init(function(message, responseCallback) {
						var data = {
							'Javascript Responds': 'Wee!'
						}
						responseCallback(data);
					});

					if (self.url.from == 'pcIndex') {
						bridge.registerHandler('goBackBtnHandler', function(data, responseCallback) {
							var backLink = webUrl + "/view/2017/holiday2/activity.html?interaction=1&userId=" + self.url.loginId + "&from=pcIndex";
							responseData = {
								'title': "钱保姆",
								'href': backLink,
								'icon': 2,
								'backBtn': 0
							};
							responseCallback(responseData);
							if (typeof data == "string") data = JSON.parse(data);
							if (data.result) location.href = backLink;
						});

					} else if (self.url.from == 'intro') {
						bridge.registerHandler('goBackBtnHandler', function(data, responseCallback) {
							var backLink = webUrl + "/view/2017/holiday2/activity.html?interaction=1&userId=" + self.url.loginId + "&from=intro";
							responseData = {
								'title': "钱保姆理财",
								'href': backLink,
								'icon': 2,
								'backBtn': 0
							};
							responseCallback(responseData);
							if (typeof data == "string") data = JSON.parse(data);
							if (data.result) location.href = backLink;
						});

					} else {
						bridge.registerHandler('goBackBtnHandler', function(data, responseCallback) {
							responseData = {
								'title': "钱保姆理财",
								'href': '',
								'icon': 2,
								'backBtn': 1
							};
							responseCallback(responseData);
							if (typeof data == "string") data = JSON.parse(data);
							if (data.result) location.href = webUrl + "/view/2017/holiday2/activity.html?interaction=1&userId=" + self.url.loginId;
						});
					}
				});
				//E-APP交互相关
			},
			//获取活动规则
			getRule: function() {
				var self = this;
				$.ajax({
					type: "get",
					url: webUrl + "/holiday/getHolidayActivity.html",
					data: {
						nId: self.url.nid
					},
					dataType: "jsonp",
					success: function(data) {
						console.log(data);
						if (typeof responseData == "string") {
							data = JSON.parse(data);
						}
						if (data.result) {
							$(".rule").html(data.holidayActivity.activityRlue);
						}
					}
				});
			},

		};

		var app = new App();

	});
});