const util = require('../../../utils/util.js')
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

    // 动态设置导航栏标题
    wx.setNavigationBarTitle({
      title: type
    })

    // 根据标题构建请求url
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

  /**
   * 页面上拉触底事件的处理函数
   * 页面下拉刷新和组件 scroll-view 冲突，加载更多改用事件触发
   */
  onReachBottom() {
    if (!this.data.hasNoData) {
      this.onScrollLower()
    }
  },

  /**
   * 提取数据
   * @param data
   */
  processDoubanData(data) {
    let movies = []
    let subject
    let title
    let temp

    // 请求的数组为空时
    if (data.length === 0) {
      this.setData({
        hasNoData: true
      })
    }

    for (let key in data) {
      subject = data[key]
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
      totalCount: this.data.totalCount + 20
    })

    // 数据加载成功后隐藏导航条加载动画
    wx.hideNavigationBarLoading()
  },

  /**
   * 滚动到底部时加载更多数据
   */
  onScrollLower() {
    const db = wx.cloud.database()
    db.collection('movies')
      .where(query)
      .skip(this.data.totalCount)
      .get()
      .then(res => {
        console.log(res.data)
        this.processDoubanData(res.data)
      })

    wx.showNavigationBarLoading()
  },

  /**
   * 下拉刷新调用函数(同时显示下拉动画)
   */
  onPullDownRefresh() {
    // 清空原有数据
    this.setData({
      movie: {},
      isEmpty: true
    })

    db.collection('movies')
      .where(query)
      .get()
      .then(res => {
        console.log(res.data)
        this.processDoubanData(res.data)
      })

    wx.stopPullDownRefresh()
  }
})
