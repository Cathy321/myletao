
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
})