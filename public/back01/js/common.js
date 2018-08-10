//进入任何页面之前判断用户是否登录, 实现登录拦截
if(location.href.indexOf('login.html') === -1) {
  //只要不是登录页, 就进行登录拦截判断
  $.ajax({
    type: 'get',
    url: '/employee/checkRootLogin',
    dataType: 'json',
    success: function(info) {
      if(info.success) {
        console.log('已登录');
      }
      if(info.error === 400) {
        location.href = 'login.html';
      }
    }
  })
}

//1-进度条功能实现
$(document).ajaxStart(function() {
  NProgress.start();
})
$(document).ajaxStop(function() {
  setTimeout(function() {
    NProgress.done();
  }, 500)  
})

$(function() {
  //2-侧边栏二级菜单切换
  $('.lt-aside .category').click(function() {
    $('.lt-aside .child').stop().slideToggle();
  })

  //3-点击切换侧边栏的显示与隐藏
  $('.icon-menu').click(function() {
    $('.lt-layout').toggleClass('hidemenu');
    $('.lt-aside').toggleClass('hidemenu');
    $('.lt-topbar').toggleClass('hidemenu');
  })

  //4-点击退出菜单, 弹出模态框
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
        if(info.success) {
          location.href = 'login.html';
        }
      }
    })
  })
})