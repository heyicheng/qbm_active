define(function(require, exports, module) {
    "use strict";
    require('zepto');
    require('fastclick');

    FastClick.attach(document.body);

    $(function() {

        var App = function() {

            this.url = {
                loginId: getUrlParam('userId'),
            };
            this.init();
        };

        App.prototype = {
            init: function() {
                var self = this;
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

                    bridge.callHandler('goLoadPageHandler', { 'title': '', 'href': '', 'icon': 1, 'backBtn': 0 }, function(responseData) {
                        if (typeof responseData == "string") responseData = JSON.parse(responseData);
                        if (responseData.result) console.log("重置参数成功!!");
                    });
                    bridge.registerHandler('goBackBtnHandler', function(data, responseCallback) {
                        var backLink = webUrl + "/view/2017/superAgent/index.html?interaction=1&userId=" + self.url.loginId;
                        var responseData = { 'title': "超级经纪人", 'href': backLink, 'icon': 2, 'backBtn': 1 };
                        responseCallback(responseData);
                        if (typeof data == "string") data = JSON.parse(data);
                        if (data.result) location.href = backLink;
                    });
                });
                //E-APP交互相关
            },

        };

        var app = new App();

    });
});