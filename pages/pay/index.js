/*
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中（这些数据checked=true）
2 微信钱包支付
  1 哪些人 哪些账号 可以实现微信支付
    1 微信企业账号
    2 企业账号的小程序后台 必须给开发者 添加到白名单
      1 1个appid可以同时绑定多个开发者
      2 这些开发者就可以共用这个appid和它的开发权限
    https://api.zbztb.cn/api/public/v1/users/wxlogin
3 点击支付按钮
  1 先判断缓存中有木有token
  2 没有 跳转到授权页面 进行获取令牌token
  3 由token。。。
*/
import { getSetting, chooseAddress, openSetting, showModel, showToast } from "../../utils/asyncWX.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow: function () {
    // 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);

    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      cart, totalPrice, totalNum, address
    });
  },
  handleOrderPay(){
    // 1 判断缓存中有木有token
    const token=wx.getStorageSync("token");
    // 2 判断有木有凭据token
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    console.log("已经由凭据了token")
  }
});