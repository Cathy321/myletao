

$(function() {
  //1-定义变量
  var currentPage = 1;
  var pageSize = 5;
  //2-通过ajax发送请求获取数据, 使用模板引擎进行渲染
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
        // console.log(info);
        var str = template('secondTmp', info);
        $('tbody').html(str);
        //3-进行分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total/info.size),
          onPageClicked: function(a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }

  //4-点击添加分类按钮, 显示模态框, 
  $('#addBtn').click(function() {
    $('#addModal').modal('show');
    //同时发送ajax请求获取一级分类数据,使用模板引擎进行渲染
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function(info) {
        var str = template('dropdownTmp', info);
        $('.dropdown-menu').html(str);
      }
    })
  });

  //5-通过事件委托, 给dropdown-menu下的所有 a 绑定点击事件
  $('.dropdown-menu').on('click', 'a', function() {
    //获取a的文本
    var txt = $(this).text();
    //设置给dropdownText
    $('#dropdownText').text(txt);
    //获取a的id
    var id = $(this).data('id');
    //将id设置给隐藏域
    $('[name="categoryId"]').val(id);
    //将隐藏域校验状态设置成校验成功状态
    $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');
  })

  //6-进行文件上传初始化
  //1.引包 2.准备结构 name data-url 3.初始化
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function(e, data) {
      console.log(data.result.picAddr);
      var imgUrl = data.result.picAddr;
      $('#imgBox img').attr('src', imgUrl);
      //将图片地址设置给input
      $('[name="brandLogo"]').val(imgUrl);
      //手动重置隐藏域的校验状态
      $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
    }
  });

  //7-实现表单校验
  $('#form').bootstrapValidator({
    excluded: [],
    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',     // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    //配置字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: '请输入二级分类'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请选择图片'
          }
        }
      },
    }
  });

  //8-注册表单校验成功事件, 阻止默认提交, 通过 ajax 进行提交
  $('#form').on('success.form.bv', function(e) {
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function(info) {
        if (info.success) {
          //关闭模态框
          $('#addModal').modal('hide');
          //设置当前页为第一页
          currentPage = 1;
          //重新渲染第一页
          render();
          //重置表单
          $('#form').data('bootstrapValidator').resetForm(true);
          //重置下拉按钮和图片路径
          $('#dropdownText').text('请选择一级分类');
          $('#imgBox img').attr('src', './images/none.png');
        }
      }
    })
  })

})