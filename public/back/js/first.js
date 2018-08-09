

$(function() {
  //1-定义变量
  var currentPage = 1;
  var pageSize = 5;
  //2-进入页面 发送ajax请求 获取数据渲染到页面中
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
          currentPage: info.page,
          totalPages: Math.ceil(info.total/info.size),
          onPageClicked: function(a, b, c, page) {
            //更新当前页
            currentPage = page;
            //重新渲染页面
            render();
          }
        })
      }
    })
  }

  //4-点击添加按钮, 弹出模态框
  $('#addBtn').click(function() {
    $('#addModal').modal('show');
  })

  //5-使用表单校验插件, 实现模态框中表单校验
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

  //6-注册表单校验成功事件, 通过ajax发送请求提交
  $('#form').on('success.form.bv', function(e) {
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/category/addTopCategory',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function(info) {
        if(info.success) {
          //关闭模态框
          $('#addModal').modal('hide');
          currentPage = 1;
          //渲染第一页
          render();
          //重置模态框表单
          $('#form').data('bootstrapValidator').resetForm(true);
        }
      }
    })
  })
})