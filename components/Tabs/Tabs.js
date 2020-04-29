
Component({
  /**
   * 组件的属性列表,对外的数据
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据，对内的数据，和properties一起用于组件模版的渲染
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap: function (e) {
      console.log(this);
      console.log(e.currentTarget);
      // 1 获取被点击的索引
      const index = e.currentTarget.dataset.index; // const { index } = e.currentTarget.dataset
      // 2 触发父组件中的自定义事件
      this.triggerEvent("tabsItemChange", { index });
    }
  }
})
