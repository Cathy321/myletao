

$(function() {
  //1.一进入页面 发送ajax请求, 渲染用户信息
  $.ajax({
    type: 'get',
    url: '/user/queryUserMessage',
    dataType: 'json',
    success: function(info) {
      console.log(info);
      //若未登录, 跳转到登录页
      if(info.error === 400) {
        location.href = 'login.html';
        return;
      }
      var str = template('userTmp', info);
      $('.lt-main .mui-media').html(str);
    }
  })

  //2.点击退出按钮, 实现退出功能
  $('#logout').click(function() {
    $.ajax({
      type: 'get',
      url: '/user/logout',
      dataType: 'json',
      success: function(info) {
        //退出成功, 跳回登录页
        if(info.success) {
          location.href = 'login.html';
        }
      }
    })
  })
})