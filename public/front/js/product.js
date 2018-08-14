
$(function() {
  //1.从地址栏获取id
  var productId = getSearch("productId");
  $.ajax({
    type: 'get',
    url: '/product/queryProductDetail',
    data: {
      id: productId
    },
    dataType: 'json',
    success: function(info) {
      var str = template('productTmp', info);
      $('.lt-main .mui-scroll').html(str);  
      //手动初始化轮播图
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 2000//自动轮播周期，若为0则不自动播放，默认为0；
      });
      //手动初始化数字框
      mui('.mui-numbox').numbox();
    }
  })

  //2.给尺码添加选中功能
  $('.lt-main').on('click', '.lt-size span', function() {
    $(this).addClass('current').siblings().removeClass('current');
  })

  //3.加入购物车功能
  //给购物车按钮添加点击事件,获取尺码和数量, 发送ajax请求
  $('#addCart').click(function() {
    var size = $('.lt-size span.current').text();
    var num = $('.lt-num input').val();
    //验证size是否已选
    if(!size) {
      mui.toast('请选择尺码');
      return;
    }
    //发送ajax请求
    $.ajax({
      type: 'post',
      url: '/cart/addCart',
      data: {
        productId: productId,
        size: size,
        num: num
      },
      dataType: 'json',
      success: function(info) {
        if(info.success) {
          mui.confirm('添加成功', '温馨提示', ['去购物车', '继续浏览'], function(e) {
            if(e.index === 0) {
              //去购物车
              location.href = 'cart.html';
            }
          })
        }
        //若用户没登录,去登录页
        if(info.error === 400) {
          //跳到登录页, 将来登录成功会回到原页面, 所以把当前页面地址传递给登录页
          location.href = 'login.html?retUrl=' + location.href;
        }
      }
    })
  })
})