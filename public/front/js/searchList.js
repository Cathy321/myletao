

$(function() {
  var currentPage = 1;
  var pageSize = 2;

  //封装渲染方法
  function render(callback) {
    //参数处理
    //1-三个必选参数
    var params = {};
    params.proName = $('.search-input').val();
    params.page = currentPage;
    params.pageSize = pageSize;
    //2-两个可选参数
      // 1.通过判断有没有current类, 决定是否是需要排序
      // 2.通过判断箭头方向, 决定升序还是降序, 2 表示降序, 1 表示升序
    var $current = $('.lt-sort a.current');
    if($current.length > 0) {
      var sortName = $current.data('type');
      var sortValue = $current.find('i').hasClass('fa-angle-down')? 2 : 1;
      params[sortName] = sortValue;
    }

    setTimeout(function() {
      $.ajax({
        type: 'get',
        url: '/product/queryProduct',
        data: params,
        dataType: 'json',
        success: function(info) {
          console.log(info);
          callback && callback(info);
        }
      })
    }, 1000)
  }

  //功能1: 获取地址栏参数, 设置给input, 并根据input的值渲染一次
  var key = getSearch("key");
  $('.search-input').val(key);
  render();

  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback : function() {
          //下拉刷新 重置当前页
          currentPage = 1;
          render(function(info) {
            var str = template("listTmp", info);
            $('.lt-product').html(str);
            //关闭下拉刷新
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            //重新启用上拉加载
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          });
        }
      },
      //上拉加载
      up: {
        callback: function() {
          currentPage++;
          render(function(info) {
            var str = template("listTmp", info);
            $('.lt-product').append(str);
            // 需要在数据回来之后关闭上拉加载
            // endPullupToRefresh(boolean)
            // 1. false 还有更多数据
            // 2. true  没有更多数据了
            if(info.data.length === 0) {
              // 没有更多数据了, 默认会禁用上拉加载
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(true);
            }else {
              //还有数据, 可以进行加载更多
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(false);
            }
          })
        }
      }
    }
  });

  //功能2: 点击搜索按钮, 根据input的值, 重新渲染页面,
  //将搜索的内容添加到历史记录中
  $('.search-btn').click(function() {
    var value = $('.search-input').val();
    //获取本地存储的数据
    var jsonStr = localStorage.getItem('search-list');
    var arr = JSON.parse(jsonStr);
    //将input的值添加到数组的最前面
    //不能重复
    var index = arr.indexOf(value);
    if(index > -1) {
      arr.splice(index, 1);
    }
    //不能超过10个
    if(arr.length >= 10) {
      arr.pop();
    }
    arr.unshift(value);
    //转回json字符串, 重新存回本地存储
    localStorage.setItem("search-list", JSON.stringify(arr));
    //重新渲染, 触发一次下拉刷新即可
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
  })

  //功能3: 排序功能, 有了需要多传的参数(在render进行处理)
  //这里切换类即可
  $('.lt-sort a[data-type]').on('tap', function() {
    if($(this).hasClass("current")) {
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }else {
      $(this).addClass("current").siblings().removeClass("current");
    }
    //重新渲染, 触发一次下拉刷新即可
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
  })

  
})