$(function() {
  //1-定义变量
  var currentPage = 1;
  var pageSize = 5;
  //2-渲染
  render();
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function(info) {
        console.log(info);
        var str = template('firstTmp', info);
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

  //4-点击按钮显示模态框
  $('#addBtn').click(function() {
    $('#addModal').modal('show');
  })

  //5-表单校验
  $('#form').bootstrapValidator({
    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',     // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    //配置字段
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: '一级分类不能为空'
          }
        }
      }
    }
  });

  //6-注册表单校验成功事件
  $('#form').on('success.form.bv', function(e) {
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/category/addTopCategory',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function(info) {
        if(info.success) {
          $('#addModal').modal('hide');
          currentPage = 1;
          render();
          $('#form').data('bootstrapValidator').resetForm(true);
        }
      }
    })
  })
})