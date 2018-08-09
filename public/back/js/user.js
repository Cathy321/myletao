
$(function() {
  //1-定义变量
  var currentPage = 1;
  var pageSize = 5;
  var currentId;
  var isDelete;
  //2-进入页面,发送ajax请求,获取用户列表数据,通过模板引擎渲染
  //封装渲染方法
  render();
  function render() {
    $.ajax({
      type: 'get',
      url: '/user/queryUser',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function(info) {
        console.log(info);
        var str = template('tmp', info);
        $('tbody').html(str);

        //3-分页初始化
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: currentPage,//当前页
          totalPages: Math.ceil(info.total/info.size),//总页数
          onPageClicked:function(a, b, c, page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            //重新渲染当前页
            render();
          }
        });
      }
    })
  };

  //4-点击禁用启用按钮, 显示模态框
  $('tbody').on('click', '.btn', function() {
    $('#userModal').modal('show');
    //获取用户id
    currentId = $(this).parent().data('id');
    //获取对应的状态值(1为启用, 0为禁用)
    isDelete = $(this).hasClass('btn-danger')? 0 : 1;
  })

  //5-点击模态框中的确认按钮,发送ajax请求 修改对应用户的状态
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
          //隐藏模态框
          $('#userModal').modal('hide');
          //重新渲染当前页
          render();
        }
      }
    })
  })

  
})