var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  data: {
    height: 20,
    focus: false,
    cust_id: 0,    
    cust_addr_room: [],
    cust_name: [],
    cust_phone: [],
    cust_Wechat:[],
    addr_index:0,//用于修改订单确定页面的数据
    // dormitory:保存picker中的下拉信息
    dormitory:[
      "C1",
      "C2",
      "C3",
      "C4",
      "C5",
      "C6",
      "C7",
      "C8",
      "C9",
      "C10",
      "c11",
      "c12",
      "c13",
      "c14",
      "c15",
    ],
    // dormitory_index：标志选中的下标
    dormitory_index:0,
    cust_addr_building:0
  },
  onLoad: function (options) {
    var that = this;
    var flag = false;
    flag = options.flag;
    that.cust_id = options.cust_id;
    that.setData({
      cust_id: options.cust_id,
      cust_addr_room: options.cust_addr_room,
      cust_name: options.cust_name,
      cust_phone: options.cust_phone,
      cust_Wechat: options.cust_Wechat,
      addr_index:options.addr_index,
      dormitory_index:options.cust_addr_building|0,
      // 保存之前的dormitory_index
      cust_addr_building:options.cust_addr_building|0
    })
  },

  formSubmit: function (e) {
    var warn = "";
    var that = this;
    var flag = false
    //判断各项输入是否为空
    if (e.detail.value.namearea == "") {
      warn = "请填写您的姓名！";
    }
    else if (e.detail.value.phonearea == "") {
      warn = "请填写您的手机号！";
    }
    else if (e.detail.value.addressarea == "") {
      warn = "请输入您的宿舍号！";
    }
    else if (e.detail.value.wechatarea == "") {
      warn = "请输入您的微信号！";
    }
    else {
      flag = true
      //提交给mock
      wx.request({
        url: config.service.changeAddressUrl +
          "?user_id=" + that.data.cust_id +//
          "&prename=" + that.data.cust_name +//
          "&prephone=" + that.data.cust_phone + //
          "&preaddr_room=" + that.data.cust_addr_room + //
          "&preaddr_building=" + that.data.cust_addr_building +//
          "&preWechat=" + that.data.cust_Wechat +//
          "&name=" + e.detail.value.namearea +
          "&phone=" + e.detail.value.phonearea +
          "&addr_room=" + e.detail.value.addressarea +
          "&Wechat=" + e.detail.value.wechatarea +
          "&addr_building=" + that.data.dormitory_index,
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "GET",
        success(res) {
          if(res.data.code==0){
            var pages = getCurrentPages();
            var prevPage = pages[pages.length-2];
            var customer = prevPage.data.customer;
            customer[that.data.addr_index].cust_addr_building = that.data.dormitory_index;
            customer[that.data.addr_index].cust_Wechat = e.detail.value.wechatarea;
            customer[that.data.addr_index].cust_addr_room = e.detail.value.addressarea;
            customer[that.data.addr_index].cust_name = e.detail.value.namearea;
            customer[that.data.addr_index].cust_phone = e.detail.value.phonearea;
            prevPage.setData({
              customer:customer
            });
            wx.showToast({
              title: '修改地址成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function (e) {
              wx.navigateBack({
                delta:1
              })
            }, 2000)
          }
          else{
            wx.showModal({
              title: '请求错误',
              content: '错误码：'+res.data.code,
              confirmText: '确定',
              success: function (res) {
                if (res.confirm) {
                }
              }
            })
          }
        }
      })
    }

    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  dormitory_change: function (e) {
    var that = this;
    that.setData({
      dormitory_index: e.detail.value
    });
  },
  //删除地址
  delSubmit: function (e) {
    var that = this;
    wx.request({
        url: config.service.delAddressUrl + 
        "?user_id=" + that.data.cust_id + 
        "&prename=" + that.data.cust_name + 
        "&prephone=" + that.data.cust_phone + 
        "&preaddr_room=" + that.data.cust_addr_room + 
        "&preaddr_building=" + that.data.cust_addr_building,
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "GET",
        success(res) {
          if(res.data.code==0){
          var pages = getCurrentPages();
          var prevPage = pages[pages.length-2];
          var customer = prevPage.data.customer;
          customer.splice(that.data.addr_index,1);
          prevPage.setData({
            customer:customer
          });
          wx.showToast({
            title: '删除地址成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function (e) {
            wx.navigateBack({
              delta:1
            })
          }, 2000)
          }
          else{
            wx.showModal({
              title: '请求错误',
              content: '错误码：'+res.data.code,
              confirmText: '确定',
              success: function (res) {
                if (res.confirm) {
                }
              }
            })
          }
        }
      })
    }
}
)