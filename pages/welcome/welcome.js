// pages/welcome/welcome.js

const baseCloudPath = getApp().globalData.baseCloudPath

Page({
  data: {
    picCloudPath: baseCloudPath + '/images/avatar.png'
  },
  onTap() {
    wx.switchTab({
      url: '/pages/movies/movies/movies'
    })
  }
})
