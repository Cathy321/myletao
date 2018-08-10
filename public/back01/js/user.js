
$(function() {
  //1-定义变量
  var currentPage = 1;
  var pageSize = 5;
  var currentId;
  var isDelete;
  //2-进入页面,发送ajax请求获取数据
  render();
  function render() {
    $.ajax({
      type: 'get',
      url: '/user/queryUser',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function(info) {
        // console.log(info);
        var str = template('userTmp', info);
        $('tbody').html(str);
        //3-进行分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil(info.total/info.size),
          currentPage: info.page,
          onPageClicked: function(a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }

  //4-实现用户禁用启用功能
  $('tbody').on('click', '.btn', function() {
    //显示模态框
    $('#userModal').modal('show');
    //获取id
    currentId = $(this).parent().data('id');
    isDelete = $(this).hasClass('btn-danger')? 0 : 1;
  })

  //5-点击确认按钮, 发送ajax请求 修改用户状态
  $('#submitBtn').click(function() {
    $.ajax({
      type: 'post',
      url: '/user/updateUser',
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: 'json',
      success: function(info) {
        if(info.success) {
          //关闭模态框
          $('#userModal').modal('hide');
          //重新渲染当前页
          render();
        } 
      }
    })
  })
})