

$(function() {
  //1-定义变量
  var currentPage = 1;
  var pageSize = 5;
  var picArr = [];
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
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil(info.total/info.size),
          currentPage: info.page,
          onPageClicked: function(a, b, c, page) {
            currentPage = page;
            render();
          },
          //设置按钮的文本
          itemTexts: function(type, page, current) {
            switch (type) {
              case "page":
                return page;
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },
          //设置按钮的title文本
          tooltipTitles: function(type, page, current) {
            switch (type) {
              case "page":
                return "前往第" + page + "页";
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },
          //使用bootstrap的tooltip组件
          useBootstrapTooltip: true
        })
      }
    })
  }

  //4-点击添加分类按钮, 显示模态框
  $('#addBtn').click(function() {
    $('#addModal').modal('show');
    //发送ajax请求, 请求二级分类数据, 进行下拉列表渲染
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
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

  //5-给下拉菜单中的a注册点击事件(事件委托)
  $('.dropdown-menu').on('click', 'a', function() {
    //获取文本设置给#dropdownText
    var txt = $(this).text();
    $('#dropdownText').text(txt);
    //将id设置给隐藏域
    var id = $(this).data('id');
    $('[name="brandId"]').val(id);
    //手动设置隐藏域的校验状态
    $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID');
  });

  //6-文件上传初始化
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function(e, data) {
      //将上传得到的图片名称和地址的图片对象存在数组中
      picArr.unshift(data.result);
      //图片地址
      var picUrl = data.result.picAddr;
      $('#imgBox').prepend('<img src="'+ picUrl +'" width="100" alt="">');
      //如果图片超过3张, 移除最早上传的那张
      if(picArr.length > 3) {
        picArr.pop();
        $('#imgBox img:last-of-type').remove();
      }
      if(picArr.length === 3) {
        //说明已经上传了三张图片, 将picStatus校验状态设置为valid
        $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID');
      }
    }
  });

  //7-进行表单校验配置
  $('#form').bootstrapValidator({
    // 对隐藏域进行校验
    excluded: [],
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',     // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    //配置字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: '请输入商品库存'
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺码必须是 xx-xx 的格式, 例如 32-40'
          }
        }
      },
      // 原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      // 现价
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      // 标记当前图片是否上传满三张
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  });

  //8-注册表单校验成功事件, 阻止默认行为, 通过ajax提交
  $('#form').on('success.form.bv', function(e) {
    e.preventDefault();
    var paramsStr = $('#form').serialize();
    paramsStr += "&picAddr1=" + picArr[0].picAddr + "&picName1="+ picArr[0].picName;
    paramsStr += "&picAddr2=" + picArr[1].picAddr + "&picName2="+ picArr[1].picName;
    paramsStr += "&picAddr3=" + picArr[2].picAddr + "&picName3="+ picArr[2].picName;

    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      data: paramsStr,
      dataType: 'json',
      success: function(info) {
        if(info.success) {
          $('#addModal').modal('hide');
          currentPage = 1;
          render();
          $('#form').data("bootstrapValidator").resetForm(true);
          //手动重置文本和图片
          $('#dropdownText').text('请选择二级分类');
          $('#imgBox img').remove();
          picArr = [];
        }
      }
    })
  })
})