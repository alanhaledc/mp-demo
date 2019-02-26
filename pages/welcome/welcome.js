// pages/welcome/welcome.js
Page({
  data: {},

  onTap: () => {
    wx.switchTab({
      url: '/pages/movies/movies'
    })
  }
})
