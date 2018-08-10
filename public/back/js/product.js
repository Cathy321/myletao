

$(function() {
  //1-定义变量
  var currentPage = 1;
  var pageSize = 5;
  //2-渲染
  render();
  function render() {
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var str = template('productTmp', info);
        $('tbody').html(str);

        //3-分页初始化
      }
    })
  }
})