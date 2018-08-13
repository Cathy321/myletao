

$(function() {
  // 要渲染历史记录, 要先读取历史记录, 下面都是进行历史记录存取操作
  // 我们需要约定一个键名, search-list

  // 将下面三句话, 可以放在控制台执行, 进行假数据初始化
  // var arr = [ "耐克", "李宁", "新百伦", "耐克王", "阿迪王" ];
  // var jsonStr = JSON.stringify( arr );
  // localStorage.setItem( "search-list", jsonStr );

  // 功能1: 历史记录渲染功能
  // (1) 读取本地历史, 得到 jsonStr
  // (2) 将 jsonStr 转换成 数组
  // (3) 通过数组, 进行页面渲染(模板引擎)
  render();
  //1-封装一个方法, 用于读取本地存储数据,并返回一个数组
  function getHistory() {
    //若读取不到数据, 默认为空数组
    var history = localStorage.getItem("search-list") || "[]";
    var arr = JSON.parse(history);
    return arr;
  }
  //读取数据并渲染的方法
  function render() {
    var arr = getHistory();
    var str = template("historyTmp", {arr: arr});
    $('.lt-history').html(str);
  }

  // 功能2: 清空历史记录功能
  // (1) 通过事件委托给清空记录绑定点击事件
  // (2) 清空, 将本地的 search_list 移除, removeItem(key);
  // (3) 重新渲染页面
  $('.lt-history').on('click', '.btn-empty', function() {
    // mui确认框
    // 参数1: 提示文本
    // 参数2: 标题
    // 参数3: 提示框按钮按钮, 要求是一个数组
    // 参数4: 点击按钮后的回调函数
    mui.confirm("您确定要清空历史记录吗?", "温馨提示", ["取消", "确认"], function(e) {
      if(e.index === 1) {
        localStorage.removeItem("search-list");
        render();
      }
    })
  })

  // 功能3: 删除单条历史记录
  // (1) 事件委托绑定点击事件
  // (2) 将下标存在删除按钮中, 点击后获取下标
  // (3) 读取本地存储, 拿到数组
  // (4) 根据下标, 从数组中将该下标的项移除,  splice
  // (5) 将数组转换成 jsonStr
  // (6) 存到本地存储中
  // (7) 重新渲染
  $('.lt-history').on('click', '.btn-delete', function() {
    var that = this;
    mui.confirm("您确定要删除该条记录吗?", "温馨提示", ["取消", "确认"], function(e) {
      if(e. index === 1) {
        //获取下标
        var index = $(that).data('index');
        //获取数组
        var arr = getHistory();
        //根据下标删除某项
        arr.splice(index,1);
        //转成json字符串
        var jsonStr = JSON.stringify(arr);
        localStorage.setItem("search-list", jsonStr);
        //重新渲染
        render();
      } 
    })
  })

  //功能4: 点击搜索按钮, 获取搜索框的值, 添加到历史记录的最前面
  $('.search-btn').click(function() {
    var value = $('.search-input').val();
    //判断搜索框是否输入了有效内容
    if(value.trim() === '') {
      mui.toast("请输入搜索关键字", {
        duration: 2000 //提示信息的持续显示时间
      });
      return;
    }
    //获取数组
    var arr = getHistory();
    //需求: 
      //1-不能有重复项,如果有, 移除之前的
    var index = arr.indexOf(value);
    if(index > -1) {
      arr.splice(index, 1);
    }
      //2-数组长度控制在10以内
    if(arr.length >= 10) {
      arr.pop();
    }
    arr.unshift(value);
    //转成json字符串, 存入本地存储
    var jsonStr = JSON.stringify(arr);
    localStorage.setItem("search-list", jsonStr);
    //重新渲染
    render();
    //清空搜索框
    $('.search-input').val('');
    //搜索完成, 跳转到搜索列表, 并将搜索关键字传递过去
    location.href = "searchList.html?key=" + value;
  })

})