/*
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中（这些数据checked=true）
2 微信钱包支付
  1 哪些人 哪些账号 可以实现微信支付
    1 微信企业账号
    2 企业账号的小程序后台 必须将开发者 添加到白名单
      1 1个appid可以同时绑定多个开发者
      2 这些开发者就可以共用这个appid和它的开发权限
    https://api.zbztb.cn/api/public/v1/users/wxlogin
3 点击支付按钮
  1 先判断缓存中有木有token
  2 没有 跳转到授权页面 进行获取令牌token
  3 由token。。。
  4 创建订单目的是获取订单编号
  5 已经完成微信支付
  6 手动删除缓存中已经选中的商品
  7 删除后的购物车数据 填充回缓存
  8 在跳转页面 

*/
import { getSetting, chooseAddress, openSetting, showModel, showToast, requestPayment } from "../../utils/asyncWX.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { request } from "../../request/index.js";

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
  async handleOrderPay() {
    try {

      // 1 判断缓存中有木有token
      const token = wx.getStorageSync("token");
      // 2 判断有木有凭据token
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      // 3 创建订单了
      // 3.1 准备请求头参数
      // const header = { Authorization: token };
      // 3.2 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }));
      const orderParams = { order_price, consignee_addr, goods }
      // 4 准备发送请求 创建订单并获取订单编号
      const { order_number } = await request({
        url: "/my/orders/create",
        method: "POST",
        data: orderParams
      });
      // 5 发起预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: {order_number} });
      // 6 发起微信支付
      await requestPayment(pay);
      // 7 查询后台订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: order_number });
      await showToast({ title: "pay success" });
      // 8 手动删除缓存中已经支付了的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);
      // 8 跳转到订单页面
      wx.navigateTo({
        url: 'pages/order/index'
      });
    }
    catch (error) {
      await showToast({ title: "pay fail" });
      console.log(error)
    }
  }
});