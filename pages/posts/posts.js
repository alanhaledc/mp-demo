const postsData = require('../../data/posts-data.js')

Page({

  data: {
    // postList: postsData
  },

  onPostTop: (e) => {
    const postId = e.currentTarget.dataset.postid
    console.log(postId);
    wx:wx.navigateTo({
      url: 'post-detail/post-detail'
    })
  },

  onLoad:  function(options) {
    // this.data.postList = postsData 无效
    this.setData({
      postList: postsData
    });
  }
})