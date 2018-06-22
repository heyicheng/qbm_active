define(function(require, exports, module) {

  require('zepto');
  require('fastclick');
  require('layer');
  require('layerCss');

  FastClick.attach(document.body);

  $(function() {
    var App = function() {
      this.param = {
        openId: getUrlParam("openId"),
        mark: getUrlParam("mark"),
        max: getUrlParam("max"),
      },

      this.init();

    };

    App.prototype = {
      init: function() {
        var self = this,
            mark = self.param.mark,
            max = self.param.max,
            openId = self.param.openId,
            phoneTest = /^1[34578]\d{9}$/;

        $(document).on("click","#loginBtn",function(){

          var flag = true;
          var phoneNo = $.trim($("#phone").val());

          //手机号验证
          if (!phoneNo || phoneNo.length != 11 || !(phoneTest.test(phoneNo))) {
            layer.open({
              type: 1,
              content: "请输入正确的手机号",
              skin: 'msg',
              time: 2,
              end:function(){
                $("#phone").focus();
                flag = false;
              }
            });
            return false;
          }

          if(flag){
            $.ajax({
              url: pcUrl+'/hb/mobileVerify.html',
              type:"get",
              dataType:"jsonp",
              data:{
                "phone": phoneNo
              },
              success:function(data){
                if(typeof data=="string"){
                  data = $.parseJSON(data);
                }
                if(data.code == 1){
                  location.href = webUrl + '/view/2017/thirdAnnicersary/redPacket/wx-main.html?openId='+openId+'&mark='+mark+'&phone='+data.phone+'&max='+max;
                }else{
                  layer.open({
                    type: 1,
                    content: data.msg,
                    skin: 'msg',
                    time: 2,
                    end:function(){
                      self.getNewImgCodeFun();
                      $("#regBtn").removeAttr("disabled");
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
        });

      },


    };

  var app = new App();

  });
});
