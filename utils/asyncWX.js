/*
promise 款的 getSetting
*/
export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

/*
promise 款的 chooseAddress
*/
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}
/*
promise 款的 openSetting
*/
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

/*
promise 款的 showModel
*/
export const showModel = ({content}) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (res) => {
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    });
}

/*
promise 款的 showToast
*/
export const showToast = ({title}) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (res) => {
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    });
}


