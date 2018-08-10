$(function() {
  //1-进入页面发送ajax请求, 获取左侧一级分类数据进行渲染
  $.ajax({
    type: 'get',
    url: '/category/queryTopCategory',
    dataType: 'json',
    success: function(info) {
      var str = template('leftTmp', info);
      $('.lt-category-left ul').html(str);
      renderSecondById(info.rows[0].id)
    }
  })

  //2-通过事件委托, 给所有的左侧 a 绑定点击事件, 点击 a 切换显示二级分类
  $('.lt-category-left').on('click', 'a', function() {
    $(this).addClass('current').parent().siblings().find('a').removeClass('current');
    //获取id
    var id = $(this).data('id');
    renderSecondById(id);
  })

  // 通过 一级分类的 id, 进行右侧二级分类的重新渲染
  function renderSecondById(id) {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategory',
      data: {
        id: id
      },
      dataType: 'json',
      success: function(info) {
        var htmlStr = template("rightTmp", info);
        $('.lt-category-right ul').html( htmlStr );
      }
    })
  }
})