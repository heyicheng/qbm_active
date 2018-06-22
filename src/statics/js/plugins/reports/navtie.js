var isMobile = {
    android: function(){
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    ios: function(){
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    blackberry: function(){
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    wp: function(){
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function(){
        return (isMobile.android() || isMobile.blackberry() || isMobile.ios() || isMobile.wp());
    },
    verify: function(_mobile){
        var myreg = /^(((13[0-9]{1})|14[0-9]{1}|15[0-9]{1}|17[0-9]{1}|18[0-9]{1})+\d{8})$/;
        return myreg.test($("#mobile").val());
    }
};

function app_alert(_msg, _callback){
    if(isMobile.android()){
        window.ajlc.alert(_msg, _callback);
    }else if(isMobile.ios()){
        document.location = 'ajlc:alert:' + _msg + ':' + _callback;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_confirm(_msg, _callback){
    if(isMobile.android()){
        window.ajlc.confirm(_msg, _callback);
    }else if(isMobile.ios()){
        document.location = 'ajlc:confirm:' + _msg + ':' + _callback;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_toast(_msg){
    if(isMobile.android()){
        window.ajlc.toast(_msg);
    }else if(isMobile.ios()){
        document.location = 'ajlc:toast:' + _msg;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_show_loading(_msg){
    if(isMobile.android()){
        window.ajlc.loading(_msg);
    }else if(isMobile.ios()){
        document.location = 'ajlc:loading:' + _msg;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_cancel_loading(_callback){
    if(isMobile.android()){
        window.ajlc.cancel_loading(_callback);
    }else if(isMobile.ios()){
        document.location = 'ajlc:cancel_loading:' + _callback;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_share(_json){
    if(isMobile.android()){
        window.ajlc.share(_json);
    }else if(isMobile.ios()){
        document.location = 'ajlc:share:' + _json;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_share_one(_json, _callback){
    if(isMobile.android()){
        window.ajlc.share_one(_json, _callback);
    }else if(isMobile.ios()){
        document.location = 'ajlc:share_one:' + _json + ':' + _callback;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_wv_close(){
    if(isMobile.android()){
        window.ajlc.wv_close();
    }else if(isMobile.ios()){
        document.location = 'ajlc:wv_close';
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_contact(_callback){
    if(isMobile.android()){
        window.ajlc.contact(_callback);
    }else if(isMobile.ios()){
        document.location = 'ajlc:contact:' + _callback;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_scroll_top(){
    if(isMobile.android()){
        window.ajlc.scroll_top();
    }else if(isMobile.ios()){
        document.location = 'ajlc:scroll_top';
    }
}

function app_login(){
    if(isMobile.android()){
        window.ajlc.login();
    }else if(isMobile.ios()){
        document.location = 'ajlc:login';
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_location(_callback){
    if(isMobile.android()){
        window.ajlc.location(_callback);
    }else if(isMobile.ios()){
        document.location = 'ajlc:location:' + _callback;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_network_state(_callback){
    if(isMobile.android()){
        window.ajlc.network_state(_callback);
    }else if(isMobile.ios()){
        document.location = 'ajlc:network_state:' + _callback;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_realname() {
    if (isMobile.android()) {
        window.ajlc.realname();
    } else if (isMobile.ios()) {
        document.location = 'ajlc:realname';
    } else {
        //alert('您的设备暂时不支持');
    }
}

function app_imgupload(_callback) {
    if (isMobile.android()) {
        window.ajlc.imgupload(_callback);
    } else if (isMobile.ios()) {
        document.location = 'ajlc:imgupload:' + _callback;
    } else {
        //alert('您的设备暂时不支持');
    }
}

function app_contact_new(_callback) {
    if (isMobile.android()) {
        window.ajlc.contact_new(_callback);
    } else if (isMobile.ios()) {
        document.location = 'ajlc:contact_new:' + _callback;
    } else {
        //alert('您的设备暂不支持');
    }
}

function app_action(_params){
    if(isMobile.android()){
        window.ajlc.action(_params);
    }else if(isMobile.ios()){
        document.location = 'ajlc:action:' + _params;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_buy_product(_parmas){
    if(isMobile.android()){
        window.ajlc.buy_product(_params);
    }else if(isMobile.ios()){
        document.location = 'ajlc:buy_product:' + _params;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_integral_product(_id, _count, _direct, _price){
    if(isMobile.android()){
        window.ajlc.integral_product(parseInt(_id), parseInt(_count), parseInt(_direct), parseInt(_price));
    }else if(isMobile.ios()){
        document.location = 'ajlc:integral_product:' + _id + ':' + _count + ':' + _direct + ':' + _price;
    }else{
        //alert('您的设备暂不支持');
    }
}

function app_corner(_icon, _callback) {
    if (_icon == '') _icon = 'http://cdn2.aijialicai.com.cn/CDN/share/share.png';
    if (isMobile.android()) {
        window.ajlc.corner(_icon, _callback);
    } else if (isMobile.ios()) {
        document.location = 'ajlc:corner:' + encodeURIComponent(_icon) + ':' + _callback;
    }
}