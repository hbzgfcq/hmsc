export const request=(params)=>{
    // 显示加载中效果
    wx.showLoading({
        title: '加载中',
        mask: true
    });
    return new Promise((resolve,reject)=>{
        const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
        wx.request({
            ...params, /* 把一个数组转换为逗号分割的参数序列 */
            url:baseUrl + params.url,
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                wx.hideLoading();
            }
        });
    })
}