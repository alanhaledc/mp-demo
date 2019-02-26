const util = require('../../../utils/util.js')
const app = getApp()
const doubanBase = app.globalData.g_doubanBase

Page({
  data: {
    movies: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  onLoad: function(options) {
    const type = options.type

    // 动态设置导航栏标题
    wx.setNavigationBarTitle({
      title: type
    })
    let dataUrl = ''

    // 根据标题构建请求url
    switch (type) {
      case '正在热映':
        dataUrl = `${doubanBase}/v2/movie/in_theaters`
        break
      case '即将上映':
        dataUrl = `${doubanBase}/v2/movie/coming_soon`
        break
      case '豆瓣Top250':
        dataUrl = `${doubanBase}/v2/movie/top250`
        break
    }
    this.setData({
      requestUrl: dataUrl
    })
    util.http(dataUrl, this.processDoubanData)
  },

  /**
   * 页面上拉触底事件的处理函数(页面下拉刷新和组件scroll-view冲突，加载更多改用事件触发)
   */
  onReachBottom: function() {
    this.onScrollLower()
  },

  /**
   * 提取数据
   * @param data
   */
  processDoubanData: function(data) {
    let movies = []
    let subject
    let title
    let temp
    const that = this

    for (let key in data.subjects) {
      subject = data.subjects[key]
      title = subject.title
      if (title.length >= 0) {
        title = title.substring(0, 6) + '...'
      }
      temp = {
        // 转化星星数为数组
        stars: util.formatStars(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }

    let totalMovies = {}

    // 如果需要绑定新加载的数据，需要和原有的数据合并在一起
    if (!this.data.isEmpty) {
      // concat 不改变原对象
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.setData({
        isEmpty: false
      })
    }
    this.setData({
      movies: totalMovies,
      totalCount: that.data.totalCount + 20
    })

    // 数据加载成功后隐藏导航条加载动画
    wx.hideNavigationBarLoading()
  },

  /**
   * 滚动到底部时加载更多数据
   */
  onScrollLower: function() {
    let nextUrl = `${this.data.requestUrl}?start=${
      this.data.totalCount
    }&count=20`
    util.http(nextUrl, this.processDoubanData)
    // 加载数据时在当前页面显示导航条加载动画
    wx.showNavigationBarLoading()
  },

  /**
   * 下拉刷新调用函数(同时显示下拉动画)
   */
  onPullDownRefresh: function() {
    let refreshUrl = `${this.data.requestUrl}?start=0&count=20`
    // 清空原有数据
    this.setData({
      movie: {},
      isEmpty: true
    })
    util.http(refreshUrl, this.processDoubanData)
    // 请求数据成功后停止下拉动画
    wx.stopPullDownRefresh()
  },

  /**
   * 跳转到电影详情页
   */
  onMovieTap: function(e) {
    const movieId = e.currentTarget.dataset.movieid
    wx.navigateTo({
      url: `/pages/movies/movie-detail/movie-detail?id=${movieId}`
    })
  }
})
