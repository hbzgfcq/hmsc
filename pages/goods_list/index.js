/*
1 用户下滑页面 滚动条触底 开始加载下一页数据
  1.1 找到滚动条触底事件（开发文档中找）
  1.2 判断是否有下一页数据(当前页号是否大于等于总页数)
  1.3 有则加载下一页数据
  1.4 没有则弹出提示

2 下拉刷新页面
  2.1 触发下拉刷新事件（需要在页面的json文件中开启一个配置项）
  2.2 重置数据数组
  2.3 将页码设置为1
  2.5 重新发送请求
  2.6 数据回来了要手动关闭等待效果
*/


import { request } from "../../request/index.js";

// 注册一个页面
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },

  QueryParams: {
    query: "",
    cid: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  totalPages: 1,

  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    const total = res.data.message.total;
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    console.log(this.totalPages);
    console.log(res);
    this.setData({
      // 解构并且拼接
      goodsList: [...this.data.goodsList, ...res.data.message.goods]
    });
    // 关闭下拉刷新
    wx.stopPullDownRefresh();
  },

  // 标题点击事件，由子组件触发的
  handleTabsItemChange: function (e) {
    // 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源头数组
    let { tabs } = this.data; // 这里的this指向当前页面对象
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({ tabs });
  },

  // 页面上滑滚动条触底事件
  onReachBottom: function () {
    console.log('滚动条触底了');
    if (this.QueryParams.pagenum >= this.totalPages) {
      console.log('no more');
      wx.showToast({
        title: 'no more'
      });
    } else {
      console.log("more and more");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  onPullDownRefresh:function(e){
    // 1 重置数据数组
    this.setData({
      goodsList:[]
    });
    // 2 将页码重置为1
    this.QueryParams.pagenum=1;
    // 3 发送数据请求
    this.getGoodsList();
  }

});