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
  1 商品被选中后 我们才拿它来计算
  2 获取购物车数组
  3 遍历
  4 商品被选中
  5 总价格+=商品的单价*商品的数量
  5 总数量+=商品的数量
  6 把计算后的价格和数量 设置回data中即可
6 商品的选取功能
  1 绑定change事件
  2 获取被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算全选 总价 总数量
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取data中的全选变量allChecked
  3 直接取反allChecked=!allChecked
  4 遍历购物车数组 让里面 商品 选中状态跟随 allChecked 改变而改变
  5 把购物车数组和选中状态设置回data中，把购物车保存到缓存中
8 商品数量的编辑
  1 "+""-"按钮 绑定同一个点击事件 区分的关键 自定义属性
    1 "+" "+1"  
    2 "-" "-1"
  2 传递被点击的商品id goods_id
  3 获取data中的购物数组 来获取需要被修改的商品对象
  4 当购物车数量=1 同时用户点击"-",弹窗（wx.showModel()）询问用户是否要删除
    点击确定执行删除，点击取消则什么都不做
  5 直接修改商品对象的数组 num
  6 把cart数组 重新设置回 缓存中 和data中 this.setCart
9 点击结算
  1 判断有没有收货地址信息
  2 判断用户有没有选购商品
  3 通过了跳转到支付页面

*/
import { getSetting, chooseAddress, openSetting, showModel, showToast } from "../../utils/asyncWX.js"
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
    this.setData({ address });
    this.setCart(cart);
  },
  // 点击收货地址
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
  },
  // 处理商品的选中
  handleItemChange: function (e) {
    // 1 获取被修改的商品对象
    const goods_id = e.currentTarget.dataset.id
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到被修改的对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 5 6 把购物车数据设定到data和缓存中
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
  },
  // 商品全选功能
  handleItemAllCheck() {
    // 1 获取data中的数据
    let { cart, allChecked } = this.data;
    // 2 allChecked取反
    allChecked = !allChecked;
    // 3 循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4 把修改后的值 填充到data或缓存中
    this.setCart(cart);

  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4 判断是否要进行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提升
      const res = await showModel({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 5 进行修改数量
      cart[index].num += operation;
      // 6 保存回缓存中和data中
      this.setCart(cart);
    }
  },
  // 点击 结算
  async handlePay() {
    // 1 判断收货地址
    const { address, totalNum} = this.data;
    if (!address.userName) {
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 2 判断用户有没有选择商品
    if (totalNum===0) {
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 3 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
});