// pages/welcome/welcome.js
Page({

  data: {

  },

  onTap: () => {
    console.log(1)
    // wx.navigateTo({
    //   url: '/pages/posts/posts',
    // })
    
    wx.redirectTo({
      url: '/pages/posts/posts',
    })
  }
})