import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({
  data: {
    // 左边栏菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧菜单项
    currentIndex: 0,
    // 右侧的滚动条距离顶部的距离
    scrollTop: 0
  },

  Cates: [],

  onLoad: function (options) {
    /*
    1 有没有缓存的旧数据 {time:Date.now,data:[...]}
    2 如果有缓存的旧数据且没过期就使用缓存中的旧数据
    3 否则就发送新的请求
    */
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      console.log('no cache');
      this.getCates();
    } else {
      if (Date.now() - Cates.times > 1000 * 100) {
        console.log('cache is time out')
        this.getCates();
      } else {
        console.log('cache is valid')
        this.Cates = Cates.data; 
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });
      }
    }
  },
  /*
  在微信小程序中使用 async await
  1 
  */ 
  async getCates() {
    const res = await request({url:"/categories"});
    this.Cates = res.data.message;
    wx.setStorageSync("cates", { time: Date.now, data: this.Cates }); 
    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    });
  },
  // getCates: function () {
  //   request({
  //     url: "/categories"
  //   })
  //     .then(res => {
  //       this.Cates = res.data.message;
  //       // 把数据放到本地缓存里
  //       wx.setStorageSync("cates", {
  //         time: Date.now,
  //         data: this.Cates
  //       });
  //       // 构造左侧的大菜单数据
  //       // let leftMenuList = this.Cates.map(v => v.cat_name);

  //       // 构造右侧的商品数据
  //       // let rightContent = this.Cates[0].children;
  //       // this.setData({
  //       //   leftMenuList,
  //       //   rightContent
  //       // });
  //     });
  // },

  // 左侧菜单的点击事件
  handleItemTap: function (e) {
    /*
    1 获取被点击标题的索引
    2 给data中的currentIndex赋值
    3 根据索引来渲染
    */
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
})

