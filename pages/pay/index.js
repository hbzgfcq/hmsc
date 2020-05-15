
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
    const cart = wx.getStorageSync("cart") || [];
    this.setData({ address });
    this.setCart(cart);
  },
  
  // 设置购物车状态同时 重新计算 底部工具栏 的数据：全选 总价 数量
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    this.setData({
      cart, totalPrice, totalNum, allChecked
    })
    wx.setStorageSync("cart", cart);
  }
  
});