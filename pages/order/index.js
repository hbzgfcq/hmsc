/*
1 页面打开的时候 onShow
  0 onShow不同于onLoad 无法在形参上接收url中的参数
  0.5 判断缓存中有没有token 
    1 没有直接跳转到授权页面
    2 有则继续执行
  1 获取url上的参数
  2 根据typ来决定页面标题的数组元素 那个被激活选中
  2 根据type去发送请求获取订单数据
  3 然后渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据
*/ 

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退货/退款',
        isActive: false
      }
    ]
  },
  onShow(options){
    // const token=wx.getStorageSync("token");
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/index'
    //   });
    //   return;
    // }
    
    // 1 获取当前小程序的页面栈-数组 长度最大值是10
    let pages =  getCurrentPages();
    // 2 数组中索引最大的页面就是当前页面
    let currentPage=pages[pages.length-1];
    // 获取url上的type参数
    const {type}=currentPage.options;
    // 激活选中页面标题
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
  async getOrders(type){
    const res=await request({url:"/my/orders/all",data:{type}}) || {};
    this.setData({
      orders:res.orders.map(v=>({
        ...v,
        create_time_cn:(new Date(v.create_time*1000).toLocaleString())
      }))
    });
  },

  changeTitleByIndex(index){ 
    // 2 修改源头数组
    let { tabs } = this.data; // 这里的this指向当前页面对象
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({ tabs });
  },
  handleTabsItemChange: function (e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    changeTitleByIndex(index);
    // 2 重新发送请求 type=index+1
    this.getOrders(index+1);
  }
})