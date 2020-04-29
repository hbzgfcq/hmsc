// 0 引入用来发送请求的方法，一定要把路径写全，因为是小程序
import { request } from "../../request/index.js"
Page({
  data: {
    // 轮播图的数据
    swiperList: [],
    // 导航条的数据
    catesList:[],
    // 楼层的数据啊
    floorList:[]
  },
  onLoad: function (options) {
    // 1 发送异步请求获取轮播图数据,通过es6的promise优化
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  getSwiperList: function () {
    request({ url: '/home/swiperdata' })
      .then(result => {
        this.setData({
          swiperList: result.data.message
        });
      })
  },
  // 获取导航条数据
  getCatesList: function () {
    request({ url: '/home/catitems' })
      .then(result => {
        this.setData({
          catesList: result.data.message
        });
      })
  },
  // 获取楼层数据
  getFloorList: function () {
    request({ url: '/home/floordata' })
      .then(result => {
        this.setData({
          floorList: result.data.message
        });
      })
  },
});