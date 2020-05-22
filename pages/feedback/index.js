/*
1 当我们点击+按钮触发tap事件时
  1 调用小程序内置的 选择图片的api
  2 获取到图片的路径数组
  3 把图片的路径存档data这个变量里面
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片组件
  1 获取被点击的元素的索引
  2 获取data中的图片数组
  3 根据索引在数组中删除对应的元素
  4 把数组回填到data中
3 当用户点击提交按钮之后
  1 获取文本域的内容 类似获取输入框的内容
    1 data中定义变量表示输入框的内容
    2 文本域绑定输入事件 事件触发的时候 把输入框的值存入到变量中
  2 对内容进行合法性验证
  3 验证通过 用户选中的图片 上传到专门的图片服务器上 返回图片的外网链接
    1 遍历图片数组
    2 一个一个上传
    3 自己维护一个图片数组 存放图片的外网链接
  4 文本域和外网的图片路径 一起提交到服务器（前端模拟而已）
  5 清空当前页面
  6 返回到上一页面

*/

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
    chooseImages: [],
    // 文本域的内容
    textAreaValue: ""
  },

  // 外网图片的路径数组
  UpLoadImgs: [],

  handleTabsItemChange: function (e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源头数组
    let { tabs } = this.data; // 这里的this指向当前页面对象
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({ tabs });
  },
  // 点击+选择你中意的图片
  handleChooseImg() {
    // 2 调用小程序内置的选择图片的api
    wx.chooseImage({
      count: 9,// 同时选择的图片的数量
      sizeType: ['original', 'compressed'], // 图片的尺寸类型 原图还是压缩
      sourceType: ['album', 'camera'], // 图片的来源有 照相机 相册
      success: (result) => {
        this.setData({
          // 图片数组进行拼接         
          chooseImages: [...this.data.chooseImages, ...result.tempFilePaths]
        })
      }
    });
  },
  // 点击自定义图片组件
  handleRemoveImage(e) {
    // 2 获取被点击的组件的索引
    const { index } = e.currentTarget.dataset;
    console.log(index);
    // 3 获取data中的图片数组
    let { chooseImages } = this.data;
    // 4 删除选中的元素
    chooseImages.splice(index, 1);
    this.setData({
      chooseImages
    })
  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textAreaValue: e.detail.value
    })
  },
  // 点击提交按钮
  handleFormSubmit(e) {
    // 1 获取文本域内容和图片数组
    const { textAreaValue, chooseImages } = this.data;
    // 2 合法性的验证
    if (!textAreaValue.trim()) {
      // 不合法的输入
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    /*
    3 准备上传到图片服务器
    上传文件的api不支持同时上传多个文件
    遍历数组一个一个上传
    */
    chooseImages.forEach((v, i) => {
      wx.uploadFile({
        url: 'https://images.ac.cn/',// 文件上传到哪里
        filePath: v,// 被上传文件的路径
        name: 'file',// 上传文件的名称 后台来获取文件 file
        formData: {},// 顺带的文本信息
        success: (result) => {
          console.log(result);
        }
      });
    });
  }
})