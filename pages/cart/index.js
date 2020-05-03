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

*/
import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWX.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({
  async handleChooseAddress() {
    console.log('干一行 行一行 一行行 行行行')
    try {
      // 获取权限设定
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断权限状态
      if (scopeAddress === false) {
        await openSetting(); // 打开授权页面
      }
      const res2 = await chooseAddress();
      console.log(res2)
    } catch (error) {
      console.log(error)
    }
    // 获取权限设定
    // wx.getSetting({
    //   success: (result) => {
    //     // 只要发现一些属性名很怪异的时候，就要使用[]形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1);
    //         }
    //       });
    //     } else {
    //       // 用户 以前拒绝过授予权限 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3);
    //             }
    //           });
    //         }
    //       });
    //     }
    //   },
    //   fail: () => { },
    //   complete: () => { }
    // });
  }
});