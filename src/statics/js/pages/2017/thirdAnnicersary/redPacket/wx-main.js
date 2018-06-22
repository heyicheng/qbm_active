define(function(require, exports, module) {

  require('zepto');
  require('fastclick');
  require('layer');
  require('layerCss');
  require("artTemplate4");

  FastClick.attach(document.body);

  $(function() {
    var App = function() {

      this.param = {
        openId: getUrlParam("openId"),
        mark: getUrlParam("mark"),
        phone: getUrlParam("phone"),
        max: getUrlParam("max"),
      },

      this.init();
      this.getDataFun();//获取数据
      this.useFun();//立即使用
      this.moreFun();//返回周年庆活动页面

    };

    App.prototype = {
      init: function() {
        var self = this;

        //S 微信相关配置
        getUrl();

        function getUrl(){
          $.ajax({
            url: pcUrl + "/hb/share.html",
            type: "get",
            data: {"url":encodeURIComponent(location.href.split('#')[0])},
            dataType: "jsonp",
            success: function(data){
              if(data.code == '0'){
                //通过config接口注入权限验证配置
                wx.config({
                  debug: false,
                  appId: data.appid,
                  timestamp: data.timestamp,
                  nonceStr: data.nonceStr,
                  signature: data.signature,
                  jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo'
                  ]
                });
                //通过error接口处理失败验证
                wx.error(function(res){
                  alert(res.errMsg);
                });
                regShare(data);
              }
            },
            error:function(){
              alert("url验签有误");
            }
          });
        }

        function regShare(data) {
          wx.ready(function(){
            wx.onMenuShareAppMessage({
              title: data.wxTitle,
              desc: data.wxDesc,
              link: data.url,
              imgUrl: pcCdnUrl+'/images/shareIcon/znq.png'
            });
            //alert('已注册获取“发送给朋友”状态事件');

            wx.onMenuShareTimeline({
              title: data.wxTitle,
              desc: data.wxDesc,
              link: data.url,
              imgUrl: pcCdnUrl+'/images/shareIcon/znq.png'
            });
            //alert('已注册获取“分享到朋友圈”状态事件');

            wx.onMenuShareQQ({
              title: data.wxTitle,
              desc: data.wxDesc,
              link: data.url,
              imgUrl: pcCdnUrl+'/images/shareIcon/znq.png'
            });
            //alert('已注册获取“分享到 QQ”状态事件');

            wx.onMenuShareWeibo({
              title: data.wxTitle,
              desc: data.wxDesc,
              link: data.url,
              imgUrl: pcCdnUrl+'/images/shareIcon/znq.png'
            });
            //alert('已注册获取“分享到微博”状态事件');
          });
        }
        //E 微信相关配置

      },
      getDataFun:function(){
        var self = this,
            openId = self.param.openId,
            mark = self.param.mark,
            phone = self.param.phone;
        

        $.ajax({
          url: pcUrl+'/hb/receive.html',
          type:"get",
          dataType:"jsonp",
          data:{
            "openid": self.param.openId,
            "mark": self.param.mark,
            "phone": self.param.phone
          },
          success:function(data){
            if(typeof data=="string"){
              data = $.parseJSON(data);
            }
            console.log(data);
            console.log("code="+data.code);
            //渲染页面数据
            var html = template("pageTpl", data);
            $('#pageData').html(html);
            
            //-1领取异常，1活动未开始，2活动已结束，4手机号已领取过，5红包不存在, 6已被别人领取完，7今日领取次数已用完, 8领取成功

            if(data.code == -1){
              $("#redPacketUsed").text("操作太频繁啦！");
            }

            if(data.code == 1){
              $("#redPacketUsed").text("活动未开始");
            }

            if(data.code == 5){
              $("#redPacketUsed").text("领取的人太多啦，重新分享试试");
            }

            if(data.code == 7){
              $("#useBtnBox").removeClass("hide");
              $("#redPacketUsed").text("今日领取次数已用完哦~");
            }

            if(data.code == 2){
              if(data.sts == 2){//已领取
                $(".account").removeClass("hide");
              }
              $("#useBtnBox").removeClass("hide");
              layer.open({
                className: 'layer-tip',
                content: "活动已结束",
                shade: false,
                time: 3
              });
            }

            if(data.code == 4){
              $(".account").removeClass("hide");
              $("#useBtnBox").removeClass("hide");
              layer.open({
                className: 'layer-tip',
                content: "您已经抢过该红包了哦！",
                shade: false,
                time: 3
              });
            }

            if(data.code == 6){
              $("#useBtnBox").removeClass("hide");
              layer.open({
                className: 'layer-tip',
                content: "您来晚了，红包已抢完！",
                shade: false,
                time: 3
              });
            }

            if(data.code == 8){
              $(".account").removeClass("hide");
              $("#useBtnBox").removeClass("hide");
              if(data.regist == 0){
                $("#useBtn").addClass("noReg");
              }
              layer.open({
                className: 'layer-tip',
                content: "领取成功",
                shade: false,
                time: 3
              });
            }

            if(data.dataList){
              var dataLength = data.dataList.length;
              console.log("dataLength="+dataLength);
              if(dataLength == 0 || dataLength == 20 ){
                $(".moreRedPacket").addClass("hide");
              }else if(data.dataList.length ){
                $(".moreRedPacket").removeClass("hide");
              }
            }
          },
          error: function() {
            layer.open({
              className: 'layer-tip',
              content: "网络请求失败，请稍后再试",
              shade: false,
              time: 2
            });
          }
        }); 

      },
      useFun:function(){
        var self = this;

        $(document).on("click","#useBtn",function(){
          if( $("#useBtn").hasClass("noReg")){
            location.href = "wx-reg.html";
          }else{
            location.href = pcUrl+"/applink.html";
          }

          
        });        

      },
      moreFun:function(){
        $(document).on("click","#more",function(){
          location.href = webUrl + "/view/2017/thirdAnnicersary/index.html?type=h5";
        });
      }


    };

  var app = new App();

  });
});
