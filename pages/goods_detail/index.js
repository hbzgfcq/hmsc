/*
this 指向页面对象
1 发送请求获取数据
2 点击轮播图预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api previewImage
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据（数组）
  3 先判断当前商品是否在购物车中
  4 已经在了 修改商品数据 指向购物车数量++ 重新把购物车数据填充回缓存  
  5 不存在 购物车数组添加一个新元素，带上购买数量属性 回填到缓存中
  6 弹出提示对话框
4 商品收藏功能
  1 页面onShow的时候 加载缓存中的商品收藏数据到缓存数组中
  2 判断当前商品是否被收藏了
    1 是 改变页面的图标
    2 不是 。。。
  3 点击收藏按钮
    1 判断该商品是否存在于缓存数组中
    2 已经存在了就删除
    3 没存在过就把商品添加到收藏数组中和缓存中
*/

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({
  data: {
    goodsObj: {}
  },
  GoodsInfo: {},
  
  onLoad: function (options) {
    
    const { goods_id } = options;
    this.getDetailData(goods_id);
  },

  async getDetailData(goods_id) {
    const goodsObj = (await request({
      url: '/goods/detail',
      data: {
        goods_id
      }
    })).data.message;
    this.GoodsInfo = goodsObj;
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),// webp->jpg
        pics: goodsObj.pics
      }
    });
  },

  handlePreviewImage(e) {
    // 1 先构造要预览的图片数组
    console.log(this.GoodsInfo);
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 2 接收传递过来的url
    const current = e.currentTarget.dataset.url;
    console.log(current);
    wx.previewImage({
      current: current,
      urls: urls
    });
  },

  handleCartAdd(e) {
    // 1 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    // 2 判断商品是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
    console.log(index);
    console.log(this.GoodsInfo);
    if (index === -1) {
      // 3 不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
      console.log('添加新商品咯');
    } else {
      // 4 存在购物车数据 num++
      cart[index].num++;
      console.log("商品数量加1");
    }
    // 5 购物车回填到缓存中
    wx.setStorageSync("cart", cart);
    // 6 弹窗提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true,// 防止用户手抖疯狂点击
    });
  }
})