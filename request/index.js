let ajaxTimes=0;

export const request=(params)=>{
    // 判断url中是否有/my/ 有表示请求的是私有路径 要带上header token
    let header={...params.header};
    if(params.url.includes("/my/")){
        // 拼接header 带上token
        header["Authorization"]=wx.getStorageSync("token");
    }
    ajaxTimes++;
    // 显示加载中效果
    wx.showLoading({
        title: '加载中',
        mask: true
    });
    
    const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
    
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params, /* 把一个数组转换为逗号分割的参数序列 */
            header:header,
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