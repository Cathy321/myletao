//1-进度条功能
//在发送第一个ajax请求时, 开启进度条
$(document).ajaxStart(function() {
  NProgress.start();
})
//在最后一个ajax请求回来时, 关闭进度条
$(document).ajaxStop(function() {
  setTimeout(function() {
    NProgress.done();
  }, 500)
});

$(function() {
  //公共功能实现
  //1-侧边栏二级菜单切换
  $('.lt-aside .category').click(function() {
    $('.lt-aside .child').stop().slideToggle();
  })

  //2-点击切换侧边栏的显示和隐藏
  $('.icon-menu').click(function() {
    $('.lt-aside').toggleClass('hidemenu');
    $('.lt-topbar').toggleClass('hidemenu');
    $('.lt-layout').toggleClass('hidemenu');
  })

  //3-点击退出菜单, 显示退出模态框
  $('.icon-logout').click(function() {
    $('#logoutModal').modal('show');
  })

  //4-点击模态框的退出按钮, 实现用户退出
  $('#logoutBtn').click(function() {
    $.ajax({
      type: 'get',
      url: '/employee/employeeLogout',
      dataType: 'json',
      success: function(info) {
        if (info.success) {
          //退出成功, 跳转到登录页
          location.href = "login.html";
        }
      }
    })
  })
})
