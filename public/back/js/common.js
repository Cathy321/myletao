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
})