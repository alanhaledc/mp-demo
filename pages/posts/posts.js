const postsData = require('../../data/posts-data.js');

Page({

  data: {
    postList: [],
    swiperList: []
  },

  /**
   * 跳转到文章详情页
   * @param e
   */
  onPostTap: (e) => {
    const postId = e.currentTarget.dataset.postid;
    wx.navigateTo({
      url: `post-detail/post-detail?id=${postId}`
    })
  },

  /**
   * 从轮播图跳转到文章详情页
   * @param e
   */
  onSwiperTap: (e) => {
    // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    // 代理
    const postId = e.target.dataset.postid;
    wx.navigateTo({
      url: `post-detail/post-detail?id=${postId}`
    })
  },

  onLoad: function (options) {
    // 设置文章数据
    this.setData({
      postList: postsData.postList
    });

    // 设置轮播图数据
    this.setData({
      swiperList: postsData.swiperList
    })
  }
})