$(function() {
  //1-校验插件初始化
  $('#form').bootstrapValidator({
    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //配置字段
    fields: {
      //校验用户名
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2-6位之间'
          },
          callback: {
            message: '用户名不存在'
          }
        }
      },
      //校验密码
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度在6-12位之间'
          },
          callback: {
            message: '密码错误'
          }
        }
      }
    }
  })

  //2-实现登录功能
  $('#form').on('success.form.bv', function(e) {
    e.preventDefault();
    //通过ajax提交请求
    $.ajax({
      type: 'post',
      url: '/employee/employeeLogin',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function(info) {
        console.log(info);
        if (info.success) {
          //跳转到首页
          location.href = 'index.html';
        }
        if(info.error === 1000) {
          //如果用户名不存在,需要将表单校验状态设置成校验失败状态, 并提示用户
          $('#form').data('bootstrapValidator').updateStatus("username", "INVALID", "callback");
        }
        if(info.error === 1001) {
          $('#form').data('bootstrapValidator').updateStatus("password", "INVALID", "callback");
        }
      }
    })
  })

  //3-解决重置按钮的bug
  $('[type=reset]').click(function() {
    $('#form').data('bootstrapValidator').resetForm();
  })
})