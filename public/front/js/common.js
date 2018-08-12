$(function() {
  //区域滚动
  // mui实现的选择器, 可以生成mui实例, 就可以调用 mui实例的方法
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条
  });

  //获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
  });
})

//通过传递的参数, 可以解析出地址栏的参数值
function getSearch(name) {
  var search = location.search;
  //解析成中文
  search = decodeURI(search);
  //将?去掉
  search = search.slice(1);
  //根据&进行切割
  var arr = search.split("&");
  var obj = {};
  arr.forEach(function(v, i) {
    var key = v.split("=")[0];
    var value = v.split("=")[1];
    obj[key] = value;
  });
  return obj[name];
}