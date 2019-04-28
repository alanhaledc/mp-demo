const app = getApp()
const doubanBase = app.globalData.g_doubanBase
const util = require('../../../utils/util.js')

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

  onLoad() {
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
  getMovieListData(url, keyStr, type) {
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'json'
      },
      success: res => {
        this.processDoubanData(res.data, keyStr, type)
      },
      fail: error => {
        console.log(error)
      }
    })
  },

  /**
   * 处理电影数据
   * @param data
   */
  processDoubanData(data, keyStr, type) {
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
      movies: movies,
      type: type
    }
    this.setData(readyData)
  },

  /**
   * 搜索输入聚焦触发
   * @param e
   */
  onBindFocus() {
    this.setData({
      isContainerShow: false,
      isSearchPanelShow: true
    })
  },

  /**
   * 搜索输入后确认触发
   * @param e
   */
  onBindConfirm(e) {
    let text = e.detail.value
    // 搜索url
    const searchUrl = `${doubanBase}/v2/movie/search?q=${text}`
    this.getMovieListData(searchUrl, 'searchResult', '')
  },

  /**
   * 关闭搜索结果
   */
  closeSearchResult() {
    this.setData({
      isContainerShow: true,
      isSearchPanelShow: false,
      // 同时清空搜索数据
      searchResult: {}
    })
  }
})
