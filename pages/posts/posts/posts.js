wx.cloud.init({ traceUser: true })
const db = wx.cloud.database()

Page({
  data: {
    postList: [],
    swiperList: []
  },

  onLoad(options) {
    db.collection('posts')
      .get()
      .then(res => {
        const postsData = res.data[0]
        this.setData({ postList: postsData.postList }) // 设置文章数据
        this.setData({ swiperList: postsData.swiperList }) // 设置轮播图数据
      })
  },

  // 跳转到文章详情页
  goPostDetailPage(e) {
    const postId = e.currentTarget.dataset.postId
    wx.navigateTo({ url: `/pages/posts/post-detail/post-detail?id=${postId}` })
  },

  // 从轮播图跳转到文章详情页
  goPostDetailPageFromSwiper(e) {
    const postId = e.target.dataset.postId
    wx.navigateTo({ url: `/pages/posts/post-detail/post-detail?id=${postId}` })
  }
})
