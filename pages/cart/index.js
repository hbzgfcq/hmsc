/*
1 获取用户收货地址
  1.1 绑定点击事件
  1.2 调用小程序内置的api获取用户的收货地址
  
  1.2 用户 允许 小程序获取收货地址 吗？scope
    1.2.1 用户点击确定的话 authSetting scope.address==true 调用api获取收货地址
    1.2.2 如果没调用过wx.chooseAddres api authSetting scope.address=undefine 调用api获取收货地址
    1.2.3 用户点击取消的话 authSetting scope.address==false
          诱导用户打开授权设置页面 给小程序获取收货地址的权限
          获取收货地址
2 页面加载完毕
  0 onLoad onShow
  1 获取缓存中的地址数据
  2 把数据设置给data中的一个变量

3 onShow
  1 获取缓存中的购物车数组
  2 把购物车数据填充到data中

*/
import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWX.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({
  data:{
    address:{},
    cart:[]
  },
  onShow:function(){
    // 获取缓存中的收货地址
    const address=wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart");
    // 2 给data赋值
    this.setData({
      address,
      cart
    });
  },
  async handleChooseAddress() {
    console.log('干一行 行一行 一行行 行行行');
    try {
      // 获取权限设定
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];

      // 如果用户禁止小程序访问收货地址，就打开授权页面
      if (scopeAddress === false) {
        await openSetting();
      }

      // 获取收货地址，并保存到缓存中
      const address = await chooseAddress();
      wx.setStorageSync("address", address);
    }
    catch (error) {
      console.log(error)
    }
  }
});