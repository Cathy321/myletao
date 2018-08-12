

$(function() {
  //功能1: 获取地址栏参数, 设置给input, 并根据input的值渲染一次
  var key = getSearch("key");
  $('.search-input').val(key);
  render();

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
    //重新渲染
    render();
  })

  //功能3: 排序功能, 有了需要多传的参数(在render进行处理)
  //这里切换类即可
  $('.lt-sort a[data-type]').click(function() {
    if($(this).hasClass("current")) {
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }else {
      $(this).addClass("current").siblings().removeClass("current");
    }
    //重新渲染
    render();
  })

  //封装渲染方法
  function render() {
    $('.lt-product').html('<div class="loading"></div>');
    //参数处理
    //1-三个必选参数
    var params = {};
    params.proName = $('.search-input').val();
    params.page = 1;
    params.pageSize = 100;
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
          var str = template("listTmp", info);
          $('.lt-product').html(str);
        }
      })
    }, 1000)
  }
})