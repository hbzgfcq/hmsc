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
  0 到商品详情页面 第一次添加商品时 手动添加了属性
    num=1;
    checked=true;
  1 获取缓存中的购物车数组
  2 把购物车数据填充到data中
4 全选的实现
  0 数据的展示
  1 onShow 获取缓存中的购物车数组
  2 根据购物车中的商品数据 所有商品都被选中 checked=true 全选就都被选中
5 总价格和总数量
  1 都需要商品被选中 我们才拿它来计算
  2 获取购物车数组
  3 遍历
  4 商品被选中
  5 总价格+=商品的单价*商品的数量
  5 总数量+=商品的数量
  6 把计算后的价格和数量 设置回data中即可

*/
import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWX.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow: function () {
    // 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // 1 计算全选
    // every数组方法会遍历 会接收一个回调函数，每次回调函数都返回true 那么erery方法返回值为true
    // 只要有一次回调函数返回false 那么不再循环执行，直接返回false
    // 空数组调用erery方法 返回值就是true
    const allChecked = (cart.length != 0) ? cart.every(v => v.checked) : false;
    // 1 总价格总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }
    });
    // 2 给data赋值
    this.setData({
      address,
      cart,
      allChecked,
      total
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