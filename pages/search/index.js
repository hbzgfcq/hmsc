/*
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖防止抖动 定时器 节流
  0 防抖一般输入框中防止重复输入 重复发送请求
  1 节流 一般用作页面上拉 
  2 定义一个全局的定时器
*/

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({

  data: {
    goods: [],
    // 取消的按钮是否显示
    isFocus: false,
    // 输入框中的值
    inputValue:""
  },
  TimeId: -1,
  handleInput(e) {
    // 1 获取输入框的值
    const { value } = e.detail;
    // 2 先检验合法性
    if (!value.trim()) {
      // 输入的值不合法
      this.setData({
        goods: [],
        isFocus: false
      });
      return;
    }
    // 3 准备发送请求获取数据
    this.setData({
      isFocus: true
    })

    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  // 发送请求获取搜索建议 数据
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } });
    let goods = res.data.message;
    this.setData({
      goods
    });
  },
  // 点击取消按钮
  handleCancel() {
    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[]
    });
  }
})