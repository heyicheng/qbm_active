// 设计图宽度
window['adaptive'].desinWidth = 750;
// body 字体大小 会将body字体大小设置为 baseFont / 100 + 'rem'  750的设计图一般设置为28,640的设计图一般设置为24
window['adaptive'].baseFont = 24;
//最大宽度
window['adaptive'].maxWidth = 750;
// 初始化
window['adaptive'].init();

/**
 * URL参数处理
 * @param {String} name
 */
var getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
var webUrl = '/webUrl';
var pcUrl = '/pcUrl';
var wapUrl = '/wapUrl';
var pcCdnUrl = '/pcCdnUrl';
var wapCdnUrl = '/wapCdnUrl';
var cdnUrl = '/cdnUrl';

if(webUrl.split('/')[1] == 'webUrl'){
	webUrl = 'https://test-activity.qbm360.com';
}

if(pcUrl.split('/')[1] == 'pcUrl'){
	pcUrl = 'https://test-web.qbm360.com';
}

if(pcCdnUrl.split('/')[1] == 'pcCdnUrl'){
	pcCdnUrl = 'https://test-image.qbm360.com/statics';
}

if(pcUrl.split('/')[1] == 'wapUrl'){
	pcUrl = 'https://test-wap.qbm360.com';
}

var versionToNum = function(appVersion) {
	if(!appVersion){
		return 0;
	}
	if(typeof appVersion != 'string'){
		appVersion = JSON.stringify(appVersion);
	}
	var numList = appVersion.split('.');
	var num = '';
	for(var i=0;i < numList.length; i++){
		num += ('' + numList[i]);
	}
	if (num.length < 4) {
		num += '0';
	}
	return parseInt(num);
}
