
$(function() {
  //1.进入页面, 发送ajax请求, 渲染购物车
  function render() {
    setTimeout(function() {
      $.ajax({
        type: 'get',
        url: '/cart/queryCart',
        dataType: 'json',
        success: function(info) {
          console.log(info);
          //若用户没登录,跳转到登录页
          if(info.error === 400) {
            location.href = 'login.html?retUrl=' + location.href;
            return;
          }
          //若用户已经登录, 则将数据渲染到页面中
          var str = template('cartTmp', {arr: info});
          $('.lt-main .mui-table-view').html(str);
          //关闭下拉刷新
          mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
        }
      })
    }, 500)
  };

  //2.下拉刷新
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback: function() {
          render();
        }
      }
    }
  });

  //3. 删除功能
    //(1) 点击事件绑定要通过事件委托绑定, 且要绑定 tap 事件
    //(2) 获取当前购物车 id
    //(3) 发送 ajax 请求进行删除
    //(4) 页面重新渲染
  $('.lt-main').on('tap', '.btn-delete', function() {
    var id = $(this).data('id');
    $.ajax({
      type: 'get',
      url: '/cart/deleteCart',
      data: {
        id: [id]
      },
      dataType: 'json',
      success: function(info) {
        //重新渲染, 触发一次下拉刷新即可
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
      }
    })
  })

  //4.编辑功能
    //(1)点击编辑按钮显示确认框
    $('.lt-main').on('tap', '.btn-edit', function() {
      //获取自定义属性的值
      var obj = this.dataset;
      var id = obj.id;
      console.log(obj);
      var str = template('editTmp', obj);
      // mui 会将所有 \n 解析成 br 标签进行换行
      // 我们需要在传递给确认框前, 将所有的 \n 去掉
      str = str.replace(/\n/g, '');
      //显示确认框
      mui.confirm(str, "编辑商品", ['确认', '取消'], function(e) {
        if(e.index === 0) {
          //说明确认修改商品
          //获取尺码和数量进行提交
          var size = $('.lt-size span.current').text();
          var num = $('.lt-num input').val();
          $.ajax({
            type: 'post',
            url: '/cart/updateCart',
            data: {
              id: id,
              size: size,
              num: num
            },
            dataType: 'json',
            success: function(info) {
              console.log(info);
              if(info.success) {
                //编辑成功,页面重新渲染, 触发下拉刷新
                mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
              }
            }
          })
        }
      });
      //手动初始化数字框
      mui(".mui-numbox").numbox();
    })

    //给编辑模态框的尺码添加选中功能
    $('body').on('tap', '.lt-size span', function() {
      $(this).addClass('current').siblings().removeClass('current');
    })

  //5.点击复选框, 将总价格设置给total
    //(1)点击时开始计算价格,获取所有被选中的复选框, 计算价格
    //(2)计算完成赋值给total文本
    $('.lt-main').on('click', '.ck', function() {
      var totalPrice = 0;
      //遍历所有被选中的复选框, 将价格加起来
      $('.ck:checked').each(function(index, ele) {
        var price = $(this).data('price');
        var num = $(this).data('num');
        totalPrice += price * num;
      });
      //保留两位小数
      totalPrice = totalPrice.toFixed(2);
      //设置给total
      $('#total').text(totalPrice);
    })

})