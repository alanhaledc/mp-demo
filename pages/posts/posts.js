const postsData = require('../../data/posts-data.js');

Page({

  data: {
    // postList: postsData
  },

  onPostTap: (e) => {
    const postId = e.currentTarget.dataset.postid;
    wx.navigateTo({
      url: `post-detail/post-detail?id=${postId}`
    })
  },

  onSwiperTap: (e) => {
    // 代理
    // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    const postId = e.target.dataset.postid;
    wx.navigateTo({
      url: `post-detail/post-detail?id=${postId}`
    })
  },

  onLoad:  function(options) {
    // this.data.postList = postsData 无效
    this.setData({
      postList: postsData
    });
  }
})