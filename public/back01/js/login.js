$(function() {
  //1-校验插件初始化
  $('#form').bootstrapValidator({
    //配置字体图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //配置字段
    fields: {
      //校验用户名
      username: {
        validators:{
          //不能为空
          notEmpty:{
              message:"用户名不能为空"
          },
          stringLength:{
              min: 2,
              max: 6,
              message:"用户名长度必须在2-6之间"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      //校验密码
      password: {
        validators:{
          notEmpty:{
              message:"密码不能为空"
          },
          stringLength:{
              min: 6,
              max: 12,
              message:"密码长度在6-12位之间"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  })

  //2-实现登录功能
  //校验成功后, 通过ajax提交登录请求
  $('#form').on('success.form.bv', function(e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $('#form').serialize(),
      dataType: "json",
      success: function(info) {
        console.log(info);
        if (info.success) {
          location.href = "index.html";
        }
        if(info.error === 1000) {
          $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
        }
        if(info.error === 1001) {
          $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
        }
      }
    })
  })

  //3-重置按钮
  $('[type=reset]').click(function() {
    $('#form').data('bootstrapValidator').resetForm();
  })
})