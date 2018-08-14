$(function() {
  //1.登录功能
  //(1)给登录按钮添加点击事件,
  //(2)获取用户名和密码
  //(3)发送ajax进行登录验证
    //登录成功: 若有地址传递, 则跳回传递的地址
              //若没有地址, 则跳到个人中心
    //登录失败, 则提示登录失败
  $('#loginBtn').click(function() {
    var username = $('#username').val();
    var password = $('#password').val();
    //判断用户名和密码是否为空
    if(username.trim() === '') {
      mui.toast('请输入用户名');
      return;
    }
    if(password.trim() === '') {
      mui.toast('请输入密码');
      return;
    }
    //发送ajax
    $.ajax({
      type: 'post',
      url: '/user/login',
      data: {
        username: username,
        password: password
      },
      dataType: 'json',
      success: function(info) {
        if(info.error) {
          mui.toast('用户名或密码错误');
          return;
        }
        if(info.success) {
          if(location.search.indexOf('retUrl') > -1) {
            //传了地址, 就跳到对应地址
            var retUrl = location.search.replace('?retUrl=', '');
            location.href = retUrl;
          }else {
            //没传地址, 就跳到会员中心
            location.href = 'user.html';
          }
        }
      }
    })
  })
})