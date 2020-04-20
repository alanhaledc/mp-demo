import { formatStars } from '../../../util/index.js'

wx.cloud.init()
const db = wx.cloud.database()
let query = {}

Page({
  data: {
    movies: {},
    totalCount: 0,
    isEmpty: true,
    hasNoData: false
  },

  onLoad(options) {
    const type = options.type

    wx.setNavigationBarTitle({ title: type })

    switch (type) {
      case '正在热映':
        query = { in_theaters: true }
        break
      case '即将上映':
        query = { coming_soon: true }
        break
      case '豆瓣Top250':
        query = { top250: true }
        break
    }

    db.collection('movies')
      .where(query)
      .get()
      .then(res => {
        this.processDoubanData(res.data)
      })
  },

  // 页面上拉触底事件的处理函数
  // 页面下拉刷新和组件 scroll-view 冲突，加载更多改用事件触发
  onReachBottom() {
    if (!this.data.hasNoData) {
      this.handleScrollLower()
    }
  },

  // 下拉刷新调用函数(同时显示下拉动画)
  onPullDownRefresh() {
    this.setData({
      movies: {},
      isEmpty: true
    })

    db.collection('movies')
      .where(query)
      .get()
      .then(res => {
        this.processDoubanData(res.data)
      })

    wx.stopPullDownRefresh()
  },

  // 提取数据
  processDoubanData(data) {
    const movies = []
    let subject
    let title
    let movie

    // 请求的数组为空时
    if (data.length === 0) {
      this.setData({ hasNoData: true })
    }

    for (const key in data) {
      subject = data[key]
      title = subject.title
      if (title.length >= 0) {
        title = title.substring(0, 6) + '...'
      }
      movie = {
        stars: formatStars(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(movie)
    }

    let totalMovies = {}

    // 如果需要绑定新加载的数据，需要和原有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.setData({ isEmpty: false })
    }
    this.setData({
      movies: totalMovies,
      totalCount: this.data.totalCount + 20
    })

    wx.hideNavigationBarLoading()
  },

  // 滚动到底部时加载更多数据
  handleScrollLower() {
    const db = wx.cloud.database()
    db.collection('movies')
      .where(query)
      .skip(this.data.totalCount)
      .get()
      .then(res => {
        this.processDoubanData(res.data)
      })

    wx.showNavigationBarLoading()
  }
})
