

$(function() {
  //1-定义变量
  var currentPage = 1;
  pageSize = 5;
  //2-渲染
  render();
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function(info) {
        var str = template('secondTmp', info);
        $('tbody').html(str);
        //3-分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: info.total/info.size,
          onPageClicked: function(a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }
})