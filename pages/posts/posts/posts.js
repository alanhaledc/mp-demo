wx.cloud.init({
  traceUser: true
})
const db = wx.cloud.database()

Page({
  data: {
    postList: [],
    swiperList: []
  },

  onLoad(options) {
    wx.cloud.init({
      traceUser: true
    })
    db.collection('posts')
      .get()
      .then(res => {
        const postsData = res.data[0]
        // 设置文章数据
        this.setData({
          postList: postsData.postList
        })

        // 设置轮播图数据
        this.setData({
          swiperList: postsData.swiperList
        })
      })
  },

  /**
   * 跳转到文章详情页
   * @param e
   */
  goPostDetailPage(e) {
    const postId = e.currentTarget.dataset.postId
    wx.navigateTo({
      url: `/pages/posts/post-detail/post-detail?id=${postId}`
    })
  },

  /**
   * 从轮播图跳转到文章详情页
   * @param e
   */
  goPostDetailPageFromSwiper(e) {
    // target 指的是当前点击的组件 和 currentTarget 指的是事件捕获的组件
    // target 这里指的是 image，而 currentTarget 指的是 swiper
    // 代理
    const postId = e.target.dataset.postId
    wx.navigateTo({
      url: `/pages/posts/post-detail/post-detail?id=${postId}`
    })
  }
})
