const app = getApp()
const doubanBase = app.globalData.g_doubanBase
const util = require('../../utils/util.js')

Page({
  data: {
    // 三种类型
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    isContainerShow: true,
    isSearchPanelShow: false
  },

  onLoad: function() {
    const inTheatersUrl = `${doubanBase}/v2/movie/in_theaters?start=0&count=3`
    const comingSoonUrl = `${doubanBase}/v2/movie/coming_soon?start=0&count=3`
    const top250Url = `${doubanBase}/v2/movie/top250?start=0&count=3`
    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映')
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映')
    this.getMovieListData(top250Url, 'top250', '豆瓣Top250')
  },

  /**
   * 获取电影数据
   * @param url
   */
  getMovieListData: function(url, keyStr, type) {
    const that = this
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'json'
      },
      success: function(res) {
        that.processDoubanData(res.data, keyStr, type)
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },

  /**
   * 提取数据
   * @param data
   */
  processDoubanData: function(data, keyStr, type) {
    let movies = []
    let subject
    let title

    for (let key in data.subjects) {
      subject = data.subjects[key]
      title = subject.title
      if (title.length >= 0) {
        title = title.substring(0, 6) + '...'
      }
      let temp = {
        // 转化星星数为数组
        stars: util.formatStars(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    let readyData = {}
    readyData[keyStr] = {
      // 三种类型对象下面设置成相同的key值-movies，在movies用扩展符展开，然后在movie-list遍历时名字都是movies
      movies: movies,
      type: type
    }
    this.setData(readyData)
  },

  /**
   * 跳转到更多页面
   * @param e
   */
  onMoreTap: function(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/movies/more-movies/more-movies?type=${type}`
    })
  },

  /**
   * 跳转到电影详情页
   */
  onMovieTap: function(e) {
    const movieId = e.currentTarget.dataset.movieid
    wx.navigateTo({
      url: `/pages/movies/movie-detail/movie-detail?id=${movieId}`
    })
  },

  /**
   * 搜索输入聚焦触发
   * @param e
   */
  onBindFocus: function() {
    this.setData({
      isContainerShow: false,
      isSearchPanelShow: true
    })
  },

  /**
   * 搜索输入后确认触发
   * @param e
   */
  onBindConfirm: function(e) {
    let text = e.detail.value
    // 搜索url
    const searchUrl = `${doubanBase}/v2/movie/search?q=${text}`
    this.getMovieListData(searchUrl, 'searchResult', '')
  },

  /**
   * 关闭搜索栏
   */
  onCancelImgTap: function() {
    this.setData({
      isContainerShow: true,
      isSearchPanelShow: false,
      // 同时清空搜索数据
      searchResult: {}
    })
  }
})
