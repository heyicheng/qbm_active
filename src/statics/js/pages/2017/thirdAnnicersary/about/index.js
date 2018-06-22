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

	var events = {
		"2017": {
			"m09": ["&bull; 钱保姆受邀参加中国FinTech大会 荣获“最具创新力企业大奖”", "&bull; 钱保姆累计交易额突破114亿，注册用户突破150万"],
			"m08": ["&bull; 钱保姆受邀参加2017浙江金融创新高峰论坛，荣获“2017年浙江十佳互联网金融创新企业”"],
			"m07": ["&bull; 钱保姆荣获2017中国金融科技高峰论坛安心理财奖，并接受CCTV《城市·中国》专访"],
			"m06": ["&bull; 钱保姆“宝”护爱公益行走进浙江青苹果乐园"],
			"m05": ["&bull; 冠名彩虹爱心跑，关注残障人士，传播正能量"],
			"m04": ["&bull; 累计交易额突破100亿"],
			"m03": ["&bull; 获得内蒙古城投投资有限公司1亿元战略投资"],
			"m02": ["&bull; 举办“她经济”时代女性金融高峰论坛", "&bull; 北京银行存管上线"]
		},
		"2016": {
			"m12": ["&bull; 钱保姆获得公安部核准颁发的“国家信息系统安全等级保护三级备案”证明"],
			"m11": ["&bull; 钱保姆成为浙江省互联网金融联盟会员单位"],
			"m10": ["&bull; 钱保姆获得由互联网金融行业门户网站融途网颁发的2016年度“浙江省十佳互联网金融平台”", "&bull;钱保姆累计交易额突破70亿元，注册用户超140万人"],
			"m09": ["&bull; 钱保姆获批中华人民共和国电信与信息服务业务经营许可证（ICP许可证）"],
			"m08": ["&bull; 钱保姆与北京银行达成资金存管服务协议"],
			"m06": ["&bull; 钱保姆累计交易额突破50亿元"],
			"m05": ["&bull; 钱保姆联合著名互联网金融研究机构零壹财经在北京举办中国首届互联网+汽车金融高峰论坛"],
			"m04": ["&bull; 钱保姆获邀在乐视财经推出互联网金融安全投资咨询类节目《互联网金融行业观察》"],
			"m03": ["&bull; 钱保姆联合著名互联网金融研究机构零壹财经发布《互联网+汽车金融发展报告2016》", "&bull; 钱保姆成为中国互联网金融协会会员", "&bull; 钱保姆发起“女性理财季”，打造女性消费金融生态圈"],
			"m02": ["&bull; 钱保姆累计交易额突破30亿元"],
			"m01": ["&bull; 钱保姆受邀参加首届中国互联网金融品牌大会，获得“2015中国十佳互联网金融企业”", "&bull; 钱保姆受邀参加第七届中国国际金融改革创新论坛，荣膺“金麒麟奖·2015年中国十佳互联网金融企业”"]
		},
		"2015": {
			"m12": ["&bull; 钱保姆成为中国互联网金融行业促进会会员", "&bull; 钱保姆媒体见面会暖心举行，与会媒体十余家", "&bull; 钱保姆累计交易额突破20亿元"],
			"m11": ["&bull; 钱保姆首届投资人感恩见面会圆满举行，来自全国各地的投资人汇聚一堂", "&bull; 钱保姆出席浙江省首届汽车互联网金融峰会，探讨汽车+互联网金融未来的发展趋势", "&bull; 钱保姆累计交易额突破14亿，注册用户超78万人"],
			"m10": ["&bull; 钱保姆累计交易额突破10亿元，注册用户超60万人"],
			"m07": ["&bull; 钱保姆累计交易额突破5亿元", "&bull; 钱保姆与e签宝签署战略合作协议，保障电子签名、电子认证具有法律效力"],
			"m05": ["&bull; 钱保姆与长安保险展开深度合作，首个带保险的保单项目上线发售", "&bull; 钱保姆与长安责任保险股份有限公司正式签署《履约保证保险合作协议》", "&bull; 钱保姆与互联网金融领域风险控制服务供应商同盾科技达成全面战略合作"],
			"m04": ["&bull; 钱保姆 荣获“金典奖•中国互联网金融服务业十佳典范品牌”", "&bull; 钱保姆与安存网络科技达成全面合作", "&bull; 中央电视台中文国际频道对钱保姆进行了专题报道，并采访董事长楼晓东"],
			"m03": ["&bull; 钱保姆荣获中国消费者协会颁发的“互联网金融消费者权益保护优秀企业奖”"],
			"m02": ["&bull; 钱保姆累计交易额突破3亿元"],
			"m01": ["&bull; 钱保姆联合著名互联网金融研究机构零壹财经发布《互联网+汽车金融发展报告2016》", "&bull; 钱保姆成为中国互联网金融协会会员", "&bull; 钱保姆发起“女性理财季”，打造女性消费金融生态圈"]
		},
		"2014": {
			"m12": ["&bull; 钱保姆与贝付、易宝、联动优势等第三方支付公司达成全面合作", "&bull; 钱保姆累计交易额突破1亿元", "&bull; 钱保姆移动安卓版正式推出"],
			"m11": ["&bull; 钱保姆与浙江金融资产交易中心达成全面合作", "&bull; 钱保姆与中国建设银行达成战略合作", "&bull; 钱保姆获中国电子商务协会授予“中国电子商务诚信网站”称号", "&bull; 钱保姆正式上线运营，上线首日交易额突破千万元"],
			"m09": ["&bull; 与浙江中安担保集团有限公司达成战略合作", "&bull; 浙江佰财金融信息服务有限公司成立"]
		}
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
				if (!this.type) {
					this.app();
				}

				var mySwiper = new Swiper('.swiper-container', {
					direction: 'horizontal',
					loop: true,
					autoplay: 2500,
					autoplayDisableOnInteraction: false,
					// 如果需要分页器
					pagination: '.swiper-pagination'
				});
				this.loadEvents("2017");
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
					bridge.callHandler('goLoadPageHandler', { 'title': '登“三”望远', 'href': '', 'icon': 2, 'backBtn': 0 }, function (responseData) {
						if (typeof responseData == "string") responseData = JSON.parse(responseData);
						if (responseData.result) console.log("BANNER进入加载成功");
					});
					var sendInfo = {
						'shareTitle': '【三周年庆典】登“三”望远，正当时',
						'shareLink': webUrl + '/view/2017/thirdAnnicersary/about/index.html?type=h5',
						'shareIntro': '不忘初心，钱保姆与您砥砺前行！',
						'shareIcon': pcCdnUrl + '/images/shareIcon/znq.png'
					};

					bridge.callHandler('goSendShareInfoHandler', sendInfo, function (response) {
						if (typeof response == "string") response = JSON.parse(response);
						if (response.result) console.log("分享信息发送成功");
					});
					//app版本号信息
					bridge.callHandler('getVersionHandler', { 'ver': '1026' }, function (response) {
						if (typeof response == "string") response = JSON.parse(response);
						var appVersion = response.ver,
						    //app版本
						phoneOS = response.os,
						    //系统
						phoneType = response.phoneType; //机型


						// alert(appVersion);
						// alert(phoneOS);
						// alert(phoneType);

						if (phoneOS == "android") {
							if (appVersion == "3.1.4" || appVersion == "3.1.5") {} else {
								$(".tabBox").show();
								$(".videos").show();
								$("._videoBox").attr("style", '');
							}
						} else {
							$(".tabBox").show();
							$(".videos").show();
							$("._videoBox").attr("style", '');
						}
					});
					// 返回
					bridge.registerHandler('goBackBtnHandler', function (data, responseCallback) {
						var backLink = "/view/2017/thirdAnnicersary/index.html?interaction=1&userId=" + getUrlParam('userId');
						var responseData = { 'title': "三周年庆典", 'href': backLink, 'icon': 1, 'backBtn': 1 };
						responseCallback(responseData);
						if (typeof data == "string") data = JSON.parse(data);
						if (data.result) location.href = backLink;
					});
					$(document).on('click', '.item', function () {
						var id = $(this).data('id');
						bridge.callHandler('goPageHandler', { 'title': '', 'icon': 0, 'backBtn': 0 }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) location.href = 'https://www.qbm360.com/service/media-news-detail.html?interaction=1&id=' + id + '&from=znq';
							// if (responseData.result) location.href = `https://www.qbm360.com/app/news/detail.html?interaction=1&id=${id}&from=znq`;
						});
					});

					$(".bbs").on("click", function () {
						var id = $(this).data('id');
						var backLink = webUrl + "/view/2017/thirdAnnicersary/about/index.html?interaction=1&userId=" + getUrlParam('userId');
						//goLink需要加from=appBanner,type=1,interaction=1
						bridge.callHandler('goBbsArticleHandler', { 'title': '彩虹爱心健康跑 跑出彩色人生 杭州大型助残公益活动圆满落幕', 'goLink': 'http://bbs.qbm360.com/app/article.html?interaction=1&from=h5&id=' + id, 'href': backLink + '&interaction=1', 'backBtn': 0 }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) console.log("success");
						});
					});
					$(document).on('click', '._finLife ._btn', function () {
						var currentHref = webUrl + "/view/2017/thirdAnnicersary/about/index.html?interaction=1&userId=" + getUrlParam('userId');
						bridge.callHandler('goBackLinkHandler', { 'title': "finLife 钱保姆打响女性金融第一战", 'href': currentHref, 'icon': 0, 'backBtn': 2 }, function (responseData) {
							if (typeof responseData == "string") responseData = JSON.parse(responseData);
							if (responseData.result) location.href = "https://m.wdzj.com/news/pingtai/1052843.html";
						});
					});
				});
				//E-APP交互相关
			}
		}, {
			key: 'listen',
			value: function listen() {
				var self = this;
				// 视频tab切换
				$('._videoBox .tab').on('click', function () {
					var index = $(this).data('index');
					if (index == "0") {
						$('.videos').removeClass('video2').addClass('video1');
						$('.videos .video').hide().eq(parseInt(index)).show();
					} else {
						// layer.open({
						// 	type: 1,
						// 	content: '敬请期待！',
						// 	skin: 'msg',
						// 	time: 2
						// });

						$('.videos').removeClass('video1').addClass('video2');
						$('.videos .video').hide().eq(parseInt(index)).show();
					}
				});
				// 大事记tab切换
				$('._eventBox .tab').on('click', function () {
					var year = $(this).data('year');
					$(".tab").removeClass('active');
					$(this).addClass('active');
					$('.events').animate({ scrollTop: 0 }, 10);
					self.loadEvents(year);
				});

				if (this.type == "h5") {
					$(".tabBox").show();
					$(".videos").show();
					$("._videoBox").attr("style", '');
					$(document).on('click', '.item', function () {
						var id = $(this).data('id');
						location.href = 'https://www.qbm360.com/app/news/detail.html?id=' + id;
					});
					$(".bbs").on("click", function () {
						var id = $(this).data('id');
						location.href = 'http://bbs.qbm360.com/app/article.html?id=' + id;
					});
					$(document).on('click', '._finLife ._btn', function () {
						location.href = "https://m.wdzj.com/news/pingtai/1052843.html";
					});
				}
			}
		}, {
			key: 'loadEvents',
			value: function loadEvents(year) {
				var evtsHtml = '';
				var evts = events[year];
				for (var key in evts) {
					evtsHtml += '<p><span class="month">' + key.split("m")[1] + '\u6708:</span>';
					for (var i = 0; i < evts[key].length; i++) {
						evtsHtml += '<span class="event">' + evts[key][i] + '</span>';
					}
					evtsHtml += '</p>';
				}

				$(".events").html(evtsHtml);
			}
		}]);

		return FinLife;
	}();

	var finLife = new FinLife();
});