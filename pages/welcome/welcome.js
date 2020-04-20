const baseCloudPath = getApp().globalData.baseCloudPath

Page({
  data: {
    picCloudPath: baseCloudPath + '/images/avatar.png'
  },
  jump() {
    wx.switchTab({
      url: '/pages/movies/movies/movies'
    })
  }
})
