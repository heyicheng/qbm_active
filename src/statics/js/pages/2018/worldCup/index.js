define(function(require,exports,module){

		require('zepto');
		require('fastclick');
		require('layer');
		require('layerCss');
		require("artTemplate4");
		require("artTemplateHelper");

		FastClick.attach(document.body);

		$(function() {
			var App = function(){

				this.url = {
					type: getUrlParam('type'),//页面类型,h5为分享页面
					userId: getUrlParam('userId'),//获取用户Id(加密)
				};

				this.init();//初始化页面数据
        //this.getGameList();//获取竞猜队伍
        this.joinGameGuessOpt();//参加竞猜处理
				this.calculatorFun();//计算器
				//this.rankingsList();//排行榜
				//this.exchangeRankingsList();//兑换页-排行榜
				//this.exchangeRecordList();//兑换页-兑换记录
				//this.exchangeCoinRecordList();//兑换页-竞猜币记录
				//this.borrowList();//标的列表
				this.exchangeReceiveFun();//兑换
				this.artTemplateHelperFun();//template自定义函数
				this.app();//APP处理
				this.outSite();//非APP页面处理

			};

			App.prototype={
				init:function(){
					var self = this,
						  userId = self.url.userId;

	        //用户登录状态处理
	        if(userId == null || userId == "(null)"){
	        	userId = "";
     			}

					//页面初始化数据
					$.ajax({
							url: webUrl +'/worldcup/getBeansCount.html',
							//url: 'http://192.168.188.187:8080/worldcup/getBeansCount.html',
							type:"get",
							data:{
								"userId": userId
							},
							dataType:"jsonp",
							success:function(data){
								if(typeof data == "string"){
									data = $.parseJSON(data);
								}
								console.log(data);
								if(data.code == 2){//已参与
									//隐藏未参与内容
									$("#noAttend").addClass('hide');
									//显示已参与内容
									$("#attend").removeClass('hide');
									//隐藏兑换区
									$("#exchangeWrap").addClass('hide');
									//竞猜币回显
									$("#beansCount").text(data.beansCount);

									//显示投标计算器图标和分享图标
									$(".calculator-icon").removeClass('hide');
									$(".share-icon").removeClass('hide');

									//获取竞猜队伍
									self.getGameList(userId);
									//获取排行榜
									self.rankingsList(userId);
									//获取出借列表
									self.borrowList();

								}else if(data.code == 0){//未参与
									//显示未参与内容
									$("#noAttend").removeClass('hide');
									//隐藏已参与内容
									$("#attend").addClass('hide');
									//隐藏兑换区
									$("#exchangeWrap").addClass('hide');

									//显示活动规则
									$("#ruleWrap").removeClass('hide');
									//显示版权信息
									$(".copyRight").removeClass('hide');

								}else if(data.code == 1){//可兑换
									//隐藏未参与内容
									$("#noAttend").addClass('hide');
									//隐藏已参与内容
									$("#attend").addClass('hide');
									//显示兑换区
									$("#exchangeWrap").removeClass('hide');
									//显示版权信息
									$(".copyRight").removeClass('hide');

									$("#myCount").text(data.beansCount);

									if(!data.dataList){
										layer.open({
											className: 'layer-tip',
											content: "获取奖品数据失败！",
											shade: false,
											time: 2
										});
									}
									//数据渲染
									var html = template('prizeListTpl', data);
									$("#prizeList").html(html);

									//获取排行榜
									self.exchangeRankingsList(userId);
									//获取兑换记录
									self.exchangeRecordList(userId);
									//获取竞猜币记录
									self.exchangeCoinRecordList(userId);
								}else if(data.code == -98) {//未登录-活动期间
									//显示参与活动
								  $("#noAttend").removeClass('hide');
									//显示活动规则
									$("#ruleWrap").removeClass('hide');
									//显示版权信息
									$(".copyRight").removeClass('hide');
								}else if(data.code == -99){//未登录-兑换期间
									//隐藏未参与内容
									$("#noAttend").addClass('hide');
									//隐藏已参与内容
									$("#attend").addClass('hide');
									//显示兑换区
									$("#exchangeWrap").removeClass('hide');
									//显示版权信息
									$(".copyRight").removeClass('hide');

									//竞猜排行
									$(".exchange-rankings").addClass('hide');
									//兑换记录
									$(".exchange-record").addClass('hide');
									//兑换币记录
									$(".exchange-coin-record").addClass('hide');

								}else if(data.code == -3){
									//隐藏未参与内容
									$("#noAttend").addClass('hide');
									//隐藏已参与内容
									$("#attend").addClass('hide');
									//显示兑换区
									$("#exchangeWrap").removeClass('hide');
									//显示版权信息
									$(".copyRight").removeClass('hide');

									//获取排行榜
									self.exchangeRankingsList(userId);
									//兑换记录
									$(".exchange-record").addClass('hide');
									//兑换币记录
									$(".exchange-coin-record").addClass('hide');

									//数据渲染
									var html = template('prizeListTpl', data);
									$("#prizeList").html(html);
								}
								//code 0 未参与活动
								//code 1 可兑换
								//code 2 已参与
								//code -9 活动不存在
								//code -2 活动未开始
								//code -3  活动已结束

								if(data.code === -2  || data.code === -9){
									layer.open({
										className: 'layer-tip',
										content: data.msg,
										shade: false,
										shadeClose: false,
										time: 2
									});
								}

							},
							error:function(){
								layer.open({
									className: 'layer-tip',
									content: "数据请求失败",
									shade: false,
									time: 3
								});
							}
					});


          // if(userId != ""){
					//
          // }else{
					// 	//显示参与活动
          //   $("#noAttend").removeClass('hide');
					// 	//显示活动规则
					// 	$("#ruleWrap").removeClass('hide');
					// 	//显示版权信息
					// 	$(".copyRight").removeClass('hide');
          // }


				},
        getGameList: function (userIdVal) {
          var self = this;
          $.ajax({
              url: webUrl +'/worldcup/getGameList.html',
              type:"get",
              data:{
                "userId": userIdVal
              },
              dataType:"jsonp",
              success:function(res){
              	if(typeof res == "string"){
              		res = $.parseJSON(res);
                }

								console.log('队伍列表');
                console.log(res);

								//显示活动规则
								$("#ruleWrap").removeClass('hide');
								//显示版权信息
								$(".copyRight").removeClass('hide');

                var guessingNumber = res.dataList.length;
                if(res.result){
                  //数据渲染
                  var html = template('gameListTpl', res);
                  $("#gameList").html(html);

                  //显示可竞猜场次
                  $(".guessingNumber").text(res.canGuessCount);
                }else{
									$(".guessingNumber").text('0');
                  layer.open({
                    className: 'layer-tip',
                    content: "数据请求失败",
                    shade: false,
                    time: 2
                  });
                }
              },
              error:function(){
                layer.open({
                  className: 'layer-tip',
                  content: "数据请求失败",
                  shade: false,
                  time: 2
                });
              }
          });
        },
        joinGameGuessOpt: function(){
          var self = this,
						  userId = self.url.userId;

	        //用户登录状态处理
	        if(userId == null || userId == "(null)"){
	        	userId = "";
     			}

					var gameGuessgameIdVal,
							gameGuesswinTeamVal,
							gameGuesshasSelected,
							gameGuesshasDis,
							gameGuessdataVs,
							gameGuessbeansCount,
							gameGuesswinningDate,
							gameGuessteamResult = '';

          $(document).on('click',".vote-btn",function(){
            gameGuessgameIdVal = $(this).attr('data-gameId'),
            gameGuesswinTeamVal = decodeURIComponent($(this).attr('data-team')),//队伍
            gameGuesshasSelected = $(this).hasClass('selected'),
            gameGuesshasDis = $(this).hasClass('dis'),
						gameGuessdataVs = $(this).attr('data-vs'),//比赛队伍
            gameGuessbeansCount = $("#beansCount").text(),
						gameGuesswinningDate = $(this).attr('data-winningDate'),
						gameGuessteamResult = '';

						//竞猜确认数据处理
						if(gameGuesswinTeamVal == '平'){
							gameGuessteamResult = '战平';
						}else {
							gameGuessteamResult = gameGuesswinTeamVal+'胜';
						}

						console.log('=============某个按钮==============');
						console.log(userId,gameGuessgameIdVal,gameGuesswinTeamVal);

            if( !gameGuesshasSelected && !gameGuesshasDis){//竞猜按钮可点击
              if(gameGuessbeansCount < 5){
								//竞猜币不足提示
								layer.open({
									className: "layer-qbm",
									content: '<div class="pos-rel tip-box"><span class="pos-abs title">竞猜提示</span><div class="bd"><div class="content"><p class="line2">非常抱歉，您的竞猜币不足，<br/>请先出借后再参与竞猜</p></div><div class="btns"><span class="fn-fl btn confirm goBorrowBtn">立即出借</span><span class="fn-fr btn cancle closeLayer">取消</span></div></div></div>',
									shadeClose: false
								});
              }else{

								//竞猜确认提示
								layer.open({
									className: "layer-qbm",
									content: '<div class="pos-rel tip-box"><span class="pos-abs title">竞猜确认</span><div class="bd"><div class="content"><p class="line3">您本次竞猜“'+gameGuessdataVs+'”场中<br/>“'+gameGuessteamResult+'”，耗费5枚竞猜币，<br/>本场开奖时间：'+gameGuesswinningDate+'。</div><div class="btns"><span class="fn-fl btn confirm guessConfirmBtn">确定</span><span class="fn-fr btn cancle closeLayer">取消</span></div></div></div>',
									shadeClose: false
								});

              }

            }else{
							//已竞猜
							layer.open({
								className: "layer-qbm",
								content: '<div class="pos-rel tip-box"><span class="pos-abs title">竞猜提示</span><div class="bd"><div class="content"><p class="line1">非常抱歉，您已竞猜过该场比赛</p></div><div class="text-center btns"><span class="btn bigconfirm closeLayer">确定</span></div></div></div>',
								shadeClose: false
							});

            }
          });

					//竞猜确认-确定按钮
					$(document).on("click",".guessConfirmBtn",function(e){
						e.preventDefault();
						console.log('=============竞猜确认按钮==============');
						console.log(userId,gameGuessgameIdVal,gameGuesswinTeamVal);
						self.gameGuess(userId,gameGuessgameIdVal,gameGuesswinTeamVal);
					});

        },
				gameGuess:function(userIdVal,gameIdVal,winTeamVal){
					//比赛竞猜
					var self = this;
					$.ajax({
					    url: webUrl +'/worldcup/gameGuess.html',
					    type:"get",
					    data:{
					      "userId": userIdVal,
					      "gameId": gameIdVal,
					      "winTeam": winTeamVal
					    },
					    dataType:"jsonp",
					    success:function(res){
					    	if(typeof res == "string"){
					    		res = $.parseJSON(res);
					      }
								console.log('==============竞猜结果接口请求==============');
					      console.log(res);
					      layer.open({
					        className: 'layer-tip',
					        content: res.msg,
					        shade: false,
					        time: 2
					      });

					      //重新加载页面
					      self.init();

					    },
					    error:function(){
					      layer.open({
					        className: 'layer-tip',
					        content: "数据请求失败",
					        shade: false,
					        time: 2
					      });
					    }
					});

				},
				calculatorFun: function(){
					var self = this;

					$(document).on('click',".calculator-icon",function(){
						//竞猜币计算器
						layer.open({
							className: "layer-qbm",
							content: '<div class="pos-rel tip-box"><span class="pos-abs calculator-title">竞猜币计算器</span><div class="bd"><div class="content"><ul class="formItem"><li><span class="fn-fl formDay">购买金额</span><input type="text" class="fn-fl formInput buyMoney" placeholder="请输入购买金额"><span class="fn-fr formUnit">元</span></li><li><span class="fn-fl formDay">购买天数</span><input type="text" class="fn-fl formInput buyDay" placeholder="请输入购买天数/1月=30天"><span class="fn-fr formUnit">天</span></li><li class="result">预期竞猜币<em class="formCoin">0</em>枚</li></ul></div><div class="text-center btns"><span class="fn-fl btn confirm calculationBtn">计算</span><span class="fn-fr btn cancle closeLayer">取消</span></div></div></div>',
							shadeClose: false
						});
					});

					//计算器计算
					$(document).on('click',".calculationBtn",function(){
						var buyMoney = Number($(".buyMoney").val()),//购买金额
								buyDay = Number($(".buyDay").val()),//购买金额
								formCoin = 0;

						if(buyMoney != '' && buyDay != ''){
							formCoin = (buyMoney * buyDay)/365/80;
							console.log('formCoin='+formCoin);
						}
						$(".formCoin").text(parseInt(formCoin));

					});
				},
				rankingsList: function(userIdVal){
					$.ajax({
              url: webUrl + '/worldcup/getLeaderboard.html',
              type:"get",
              data:{
                "userId": userIdVal,
								"limit": 4
              },
              dataType:"jsonp",
              success:function(res){
                if(typeof res == "string"){
                  res = $.parseJSON(res);
                }
                //console.log(res);
                if(res.result){
                  var dataLength = res.dataList.length;
                  //console.log(dataLength);
                  if(dataLength != 0){
                    //数据渲染
                    var html = template('rankingsListTpl', res);
                    $("#rankingsList").html(html);
                  }else{
                    //$("#dataList").html('<p class="text-center nodata">暂无记录</p>');
                  }
                }else{
                  layer.open({
                    className: 'layer-tip',
                    content: res.msg,
                    shade: false,
                    time: 1
                  });
                }
              },
              error:function(){
                layer.open({
                  className: 'layer-tip',
                  content: "数据请求失败",
                  shade: false,
                  time: 3
                });
              }
          });

				},
				exchangeReceiveFun: function() {
					var self = this,
						  userId = self.url.userId,
							myCount,
							dataLevel,
							dataPrice,
							dataText,
							hasDis;
					//兑换按钮
					$(document).on("click",".receive-btn",function(){
						myCount = Number($("#myCount").text()),//我的竞猜币
						dataLevel = $(this).attr('data-level'),//奖品权重
						dataPrice =  Number($(this).attr('data-price')),//所需竞猜币
						hasDis = $(this).hasClass('dis'),//是否可用
						dataText = $(this).attr('data-text');//奖品文本

						if(!hasDis){
							if(myCount < dataPrice){//不可兑换
								//兑换失败
								layer.open({
									className: "layer-qbm",
									content: '<div class="pos-rel tip-box"><span class="pos-abs exchange-error-title">兑换失败</span><div class="bd"><div class="content"><p class="line1">很抱歉，您的竞猜币不足兑换该奖品！</p></div><div class="text-center btns"><span class="btn bigconfirm closeLayer">确定</span></div></div></div>',
									shadeClose: true
								});
							}else{
								//兑换确认
								layer.open({
									className: "layer-qbm",
									content: '<div class="pos-rel tip-box"><span class="pos-abs exchange-title">兑换确认</span><div class="bd"><div class="content"><p class="line2">确认兑换“'+dataText+'”，将花费<br/>您'+dataPrice+'枚竞猜币。</p></div><div class="text-center btns"><span class="fn-fl btn confirm confirmExchange">确定</span><span class="fn-fr btn cancle closeLayer">取消</span></div></div></div>',
									shadeClose: false
								});
							}
						}
					});

					//兑换确认
					$(document).on('click','.confirmExchange',function(){
						$.ajax({
	              url: webUrl +'/worldcup/exchange.html',
	              type:"get",
	              data:{
	                "userId": userId,
									"level": dataLevel
	              },
	              dataType:"jsonp",
	              success:function(res){
	              	if(typeof res == "string"){
	              		res = $.parseJSON(res);
	                }
	                console.log(res);

	                if(res.result){
										if(dataLevel == 2 || dataLevel == 3 || dataLevel == 4){//实物奖品
											//兑换成功-实物
											layer.open({
												className: "layer-qbm",
												content: '<div class="pos-rel tip-box"><span class="pos-abs exchange-title">兑换成功</span><div class="bd"><div class="content"><p class="line1">恭喜您成功兑换"'+dataText+'"！</p></div><div class="text-center btns"><span class="fn-fl btn confirm closeLayer">确定</span><span class="fn-fr btn confirm goAppMemberCenter">编辑收货地址</span></div></div></div>',
												shadeClose: true
											});
										}else{
											//兑换成功-非实物
											layer.open({
												className: "layer-qbm",
												content: '<div class="pos-rel tip-box"><span class="pos-abs exchange-title">兑换成功</span><div class="bd"><div class="content"><p class="line1">恭喜您成功兑换"'+dataText+'"！</p></div><div class="text-center btns"><span class="btn bigconfirm closeLayer">确定</span></div></div></div>',
												shadeClose: true
											});
										}

	                }else{
										//兑换失败
										layer.open({
											className: "layer-qbm",
											content: '<div class="pos-rel tip-box"><span class="pos-abs exchange-error-title">兑换失败</span><div class="bd"><div class="content"><p class="line2">'+res.msg+'</p></div><div class="text-center btns"><span class="btn bigconfirm closeLayer">确定</span></div></div></div>',
											shadeClose: true
										});
	                }
	              },
	              error:function(){
	                layer.open({
	                  className: 'layer-tip',
	                  content: "数据请求失败",
	                  shade: false,
	                  time: 2
	                });
	              }
	          });

					});

				},
				exchangeRankingsList: function(userIdVal){
					$.ajax({
              url: webUrl + '/worldcup/getLeaderboard.html',
              type:"get",
              data:{
                "userId": userIdVal,
								"limit": 4
              },
              dataType:"jsonp",
              success:function(res){
                if(typeof res == "string"){
                  res = $.parseJSON(res);
                }
                //console.log(res);
                if(res.result){
                  var dataLength = res.dataList.length;
                  //console.log(dataLength);
                  if(dataLength != 0){
                    //数据渲染
                    var html = template('exchangeRankingsListTpl', res);
                    $("#exchangeRankingsList").html(html);
                  }else{
                    //$("#dataList").html('<p class="text-center nodata">暂无记录</p>');
                  }
                }else{
                  layer.open({
                    className: 'layer-tip',
                    content: res.msg,
                    shade: false,
                    time: 1
                  });
                }
              },
              error:function(){
                layer.open({
                  className: 'layer-tip',
                  content: "数据请求失败",
                  shade: false,
                  time: 3
                });
              }
          });

				},
				exchangeRecordList: function(userIdVal){
					var self = this,
							userId = self.url.userId;

					$.ajax({
							url: webUrl +'/worldcup/getRewardList.html',
							//url: 'http://192.168.188.187:8080/worldcup/getRewardList.html',
							type:"get",
							data:{
								"userId": userId,
								"limit": 3
							},
							dataType:"jsonp",
							success:function(res){
								if(typeof res == "string"){
									res = $.parseJSON(res);
								}
								console.log('兑换记录');
								console.log(res);

								if(res.result){
									//数据渲染
									var html = template('exchangeRecordListTpl', res);
									$("#exchangeRecordList").html(html);
								}else{
									layer.open({
										className: 'layer-tip',
										content: "数据请求失败",
										shade: false,
										time: 2
									});
								}
							},
							error:function(){
								layer.open({
									className: 'layer-tip',
									content: "数据请求失败",
									shade: false,
									time: 2
								});
							}
					});

				},
				exchangeCoinRecordList: function(userIdVal){
					var self = this,
							userId = self.url.userId;

							$.ajax({
									url: webUrl +'/worldcup/getGuessList.html',
									//url: 'http://192.168.188.187:8080/worldcup/getGuessList.html',
									type:"get",
									data:{
										"userId": userId,
										"type": "all",
										"limit": 3
									},
									dataType:"jsonp",
									success:function(res){
										if(typeof res == "string"){
											res = $.parseJSON(res);
										}
										console.log('竞猜币记录');
										console.log(res);

										if(res.result){
											//数据渲染
											var html = template('exchangeCoinRecordListTpl', res);
											$("#exchangeCoinRecordList").html(html);
										}else{
											layer.open({
												className: 'layer-tip',
												content: "数据请求失败",
												shade: false,
												time: 2
											});
										}
									},
									error:function(){
										layer.open({
											className: 'layer-tip',
											content: "数据请求失败",
											shade: false,
											time: 2
										});
									}
							});

				},
				borrowList:function(){
					var self = this;

					$.ajax({
						type: "get",
						url: webUrl + "/worldcup/getBorrowList.html",
						dataType: 'jsonp',
						success: function(data) {
							console.log(data);
							if(data.result){
								var html = template('borrow-list-template', data);
								$("#borrowList").html(html);
							}else{

							}
						}
					})


				},
				artTemplateHelperFun:function(){
					var self = this;
					var currentTime = Date.parse(new Date())/1000;

          //竞猜按钮
          template.defaults.imports.guessingBtnsFun = function(id,isGuess,guessTeam,teamBlue,teamRed,winningDate) {
            if(isGuess == 1){
              if(guessTeam == teamBlue){
                return '<span class="fn-fl b1 vote-btn selected" data-gameId="'+id+'" data-team="'+teamBlue+'" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">胜</span>'+
                       '<span class="fn-fl b2 vote-btn dis" data-gameId="'+id+'" data-team="平" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">平</span>'+
                       '<span class="fn-fr b3 vote-btn dis" data-gameId="'+id+'" data-team="'+teamRed+'" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">胜</span>';
              }else if(guessTeam == '平'){
                return '<span class="fn-fl b1 vote-btn dis" data-gameId="'+id+'" data-team="'+teamBlue+'" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">胜</span>'+
                       '<span class="fn-fl b2 vote-btn selected" data-gameId="'+id+'" data-team="平" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">平</span>'+
                       '<span class="fn-fr b3 vote-btn dis" data-gameId="'+id+'" data-team="'+teamRed+'" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">胜</span>';
              }else {
                return '<span class="fn-fl b1 vote-btn dis" data-gameId="'+id+'" data-team="'+teamBlue+'" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">胜</span>'+
                       '<span class="fn-fl b2 vote-btn dis" data-gameId="'+id+'" data-team="平" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">平</span>'+
                       '<span class="fn-fr b3 vote-btn selected" data-gameId="'+id+'" data-team="'+teamRed+'" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">胜</span>';
              }
            }else{
              return '<span class="fn-fl b1 vote-btn" data-gameId="'+id+'" data-team="'+teamBlue+'" data-vs="'+teamBlue+'VS'+teamRed+'" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">胜</span>'+
                     '<span class="fn-fl b2 vote-btn" data-gameId="'+id+'" data-team="平" data-vs="'+teamBlue+'VS'+teamRed+'" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">平</span>'+
                     '<span class="fn-fr b3 vote-btn" data-gameId="'+id+'" data-team="'+teamRed+'" data-vs="'+teamBlue+'VS'+teamRed+'" data-vs="'+teamBlue+'VS'+teamRed+'" data-winningDate="'+winningDate+'">胜</span>';
            }
					}

					//排行榜
					template.defaults.imports.lineFun = function(index) {
            if(index == 0){
              return 'line';
            }else{
              return '';
            }
					}

          template.defaults.imports.iconFun = function(index) {
            if(index == 0){
              return 'me';
            }else if(index == 1){
              return 'one';
            }else if(index == 2){
              return 'two';
            }else if(index == 3){
              return 'three';
            }else {
              return '';
            }
					}

          template.defaults.imports.showNameFun = function(name,index) {
            if(index == 0){
              return '我';
            }else{
              return name;
            }
					}

					// 月标/天标
					template.defaults.imports.timeLimitFun1 = function(status,isday,timeLimitDay,timeLimit) {
						if(status == 1){
							if (isday == 1) { //天标
								return timeLimitDay +'<span class="small">'+'天'+'</span>';
							}
							if(isday == 0){//月标
								return timeLimit + '<span class="small">'+'个月'+'</span>';
							}
						}
					};
					//购买标百分比
					template.defaults.imports.scalePercent = function(scales) {
						return (scales*100);
					}
					//购买进度条长度
					template.defaults.imports.scaleWidth = function(scales) {
						return (scales*100).toFixed(0);
					};
					//标是否开始
					template.defaults.imports.startB = function(valid_date) {
						var five = valid_date - 300;
						if(currentTime > five){
							return '';
						}else if(currentTime <= five){
							return '即将发售'
						}
					};
				},
				app:function(){
					var self = this,
						userId = self.url.userId;

          //用户登录状态处理
	        if(userId == null || userId == "(null)"){
	        	userId = "";
     			}

					//S-APP交互相关
					function connectWebViewJavascriptBridge(callback) {//判断APP是否支持WebViewJavascriptBridge
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
							var data = { 'Javascript Responds':'Wee!' }
							responseCallback(data);
						});

            //首次加载时调用接口
            bridge.callHandler('goLoadPageHandler',{
							'title':'投标拿大奖，竞猜赢好礼',
							'href':'',
							'icon':2,
							'backBtn':1
						}, function(responseData) {
              if(typeof responseData=="string") responseData = JSON.parse(responseData);
              if(responseData.result) console.log("BANNER进入加载成功");
            });

            //发送分享信息
            var sendInfo = {
              'shareTitle': '【世界杯竞猜】iPhone，海量官方周边等你拿！',
              'shareLink': webUrl +'/view/2018/worldCup/index.html?type=h5',
              'shareIntro':'红包不限量，福利海一样！',
              'shareIcon': pcCdnUrl+'/images/shareIcon/20180618.png'
            }
						bridge.callHandler('goSendShareInfoHandler',sendInfo, function(response) {
							if(typeof response=="string")response = JSON.parse(response);
							if(response.result) console.log("分享信息发送成功");
						});

            //参与活动
            $(document).on('click',".join-btn",function(){

              if(userId != ""){
                $.ajax({
                    url: webUrl +'/worldcup/participationActivity.html',
                    type:"get",
                    data:{
                      "userId": userId,
                    },
                    dataType:"jsonp",
                    success:function(res){
                      if(typeof res == "string"){
                        res = $.parseJSON(res);
                      }
                      //console.log(res);
                      if(res.result){//参与成功
                        $("#joinBtn").addClass('hide');
                        $("#joinSuccess").removeClass('hide');

												setTimeout(function() {
													//重新初始化页面请求数据
	                        self.init();
							          },2000);

                      }else{
                        layer.open({
                          className: 'layer-tip',
                          content: res.msg,
                          shade: false,
                          time: 1
                        });
                      }
                    },
                    error:function(){
                      layer.open({
                        className: 'layer-tip',
                        content: "数据请求失败",
                        shade: false,
                        time: 1
                      });
                    }
                });
              }else{
								//登录提示
								layer.open({
									className: "layer-qbm",
									content: '<div class="pos-rel tip-box"><span class="pos-abs login-title">登录提示</span><div class="bd"><div class="content"><p class="line1">您还未登录，请先登录</p></div><div class="text-center btns"><span class="btn bigconfirm closeLayer">确定</span></div></div></div>',
									shadeClose: true,
									end: function(){
										bridge.callHandler('goLoginHandler',{'href': webUrl + '/view/2018/worldCup/index.html?interaction=1'}, function(responseData) {
                      if(typeof responseData=="string")responseData = JSON.parse(responseData);
                      if(responseData.result) console.log("success");
                    });
									}
								});
              }

            });

            //分享图标
		       	$(document).on('click',".share-icon",function(){
							bridge.callHandler('goSharePopHandler',{'status': 1}, function(responseData) {
								if (typeof responseData == "string") responseData = JSON.parse(responseData);
								if (responseData.result) console.log("success");
							});
						});

            //分享回调处理
            bridge.registerHandler('goShareStateHandler', function(data, responseCallback){
          	  if(typeof data=="string")data = JSON.parse(data);
          	  if(data.result){
                 if(data.place == 2){ //2-朋友圈
                   $.ajax({
                     type:"get",
                     url: webUrl + "/worldcup/share.html",
                     dataType:'jsonp',
                     data: {
                       'userId': userId
                     },
                     success:function(json){
                       if(typeof json == "string"){
                         json = $.parseJSON(json);
                       }

											 if(json.result){
												 //重新初始化接口
	                       self.init();

											 }

                     }
                 });
               }
              }
        	  });

            //竞猜记录
						$(document).on('click',"#goRecord",function(){
							bridge.callHandler('goPageHandler',{
								'title': '竞猜记录',
								'icon':0,
								'backBtn':0
							}, function(responseData) {
	              if(typeof responseData=="string")responseData = JSON.parse(responseData);
	              if(responseData.result) location.href = webUrl +  "/view/2018/worldCup/guessRecord.html?interaction=1&userId=" + userId;
	            });
						});

						//查看更多兑换-竞猜币记录
						$(document).on('click',"#goExchangeCoinRecord",function(){
							bridge.callHandler('goPageHandler',{
								'title': '竞猜记录',
								'icon':0,
								'backBtn':0
							}, function(responseData) {
	              if(typeof responseData=="string")responseData = JSON.parse(responseData);
	              if(responseData.result) location.href = webUrl +  "/view/2018/worldCup/guessRecord.html?interaction=1&userId=" + userId;
	            });
						});

						//查看更多兑换记录
						$(document).on('click',"#goExchangeRecord",function(){
							bridge.callHandler('goPageHandler',{
								'title': '兑换记录',
								'icon':0,
								'backBtn':0
							}, function(responseData) {
	              if(typeof responseData=="string")responseData = JSON.parse(responseData);
	              if(responseData.result) location.href = webUrl +  "/view/2018/worldCup/exchangeRecord.html?interaction=1&userId=" + userId;
	            });
						});

            //查看更多排行榜
						$(document).on('click',"#goMoreRankings",function(){
							bridge.callHandler('goPageHandler',{'title': '竞猜排行榜','icon':0,'backBtn':0}, function(responseData) {
	              if(typeof responseData=="string")responseData = JSON.parse(responseData);
	              if(responseData.result) location.href = webUrl +  "/view/2018/worldCup/guessingRankings.html?interaction=1&userId=" + userId;
	            });
						});

						$(document).on('click',"#goExchangeMoreRankings",function(){
							bridge.callHandler('goPageHandler',{
								'title': '竞猜排行榜',
								'icon':0,
								'backBtn':0
							}, function(responseData) {
	              if(typeof responseData=="string")responseData = JSON.parse(responseData);
	              if(responseData.result) location.href = webUrl +  "/view/2018/worldCup/guessingRankings.html?interaction=1&userId=" + userId;
	            });
						});

						//跳转至我要出借
						$(document).on('click',".goBorrowBtn",function(){
							document.getElementById("goBorrowList").scrollIntoView();
							layer.closeAll();
						});

		       	//标的详情
		       	$(document).on('click',".borrowDetail",function(){
							var financingId = $(this).attr("data-financingId"),//标Id
								  isNewDetail = $(this).attr("data-isDetailNew");//新标
							bridge.callHandler('goFinancingDetailFun',{'id': financingId,"isNewDetail": isNewDetail}, function(responseData) {
								if(typeof responseData=="string")responseData = JSON.parse(responseData);
								if(responseData.result) console.log("success");
							});
						});

						//跳转至我的
						$(document).on('click',".goAppMemberCenter",function(){
							bridge.callHandler('goAppModule',{'target':'userCenter'}, function(responseData) {
                if(typeof responseData=="string")responseData = JSON.parse(responseData);
                if(responseData.result) console.log("success");
              });
						});


					});
					//E-APP交互相关
				},
				outSite: function(){
					var self = this;

					//关闭弹窗
					$(document).on("click",".closeLayer",function(){
						//重新加载数据
						self.init();
						layer.closeAll();
					});

          //滚动到规则
          $(document).on('click',".rule-btn",function(){
            document.getElementById("ruleWrap").scrollIntoView();
          });

          //分享页面处理
					if(self.url.type == 'h5'){

						//分享H5下载提示
						$(document).on("click",".join-btn",function(){
							layer.open({
								className: "layer-qbm",
								content: '<div class="pos-rel tip-box"><span class="pos-abs login-title">下载提示</span><div class="bd"><div class="content"><p class="line2">马上注册参与活动，<br/>新手还能专享三重好礼哦！</p></div><div class="text-center btns"><span class="btn bigconfirm appDownBtn">去下载</span></div></div></div>',
								shadeClose: true
							});
						});

						//去下载按钮
						$(document).on('click',".appDownBtn",function(){
							//跳转至APP下载
							location.href = pcUrl +"/applink.html";
						});

            //竞猜记录
						$(document).on('click',"#goRecord",function(){
							console.log('跳转至竞猜记录');
						});

            //查看更多排行榜
						$(document).on('click',"#goMoreRankings",function(){
							console.log('查看更多排行榜');
						});

						//标的详情
						$(document).on('click',".borrowDetail",function(){
							var financingId = $(this).find($('.big1')).attr("data-financingId");//标Id
							location.href = wapUrl + '/financing/logoDetail.html?borrowId=' + financingId;
						});

					}

				},


			};

			var app =new App();

		});
});
