import { formatStars } from '../../../util/index.js'

const baseCloudPath = getApp().globalData.baseCloudPath
wx.cloud.init({ traceUser: true })
const db = wx.cloud.database()

Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    isContainerShow: true,
    isSearchPanelShow: false,
    xxIconUrl: baseCloudPath + '/images/icon/xx.png'
  },

  onLoad() {
    const inTheatersQuery = { in_theaters: true }
    const comingSoonQuery = { coming_soon: true }
    const top250Query = { top250: true }
    this.getMovieListData(inTheatersQuery, 'inTheaters', '正在热映')
    this.getMovieListData(comingSoonQuery, 'comingSoon', '即将上映')
    this.getMovieListData(top250Query, 'top250', '豆瓣Top250')
  },

  // 获取电影数据
  getMovieListData(query, keyStr, type) {
    db.collection('movies')
      .where(query)
      .get()
      .then(res => this.processDoubanData(res.data, keyStr, type))
  },

  // 处理电影数据
  processDoubanData(data, keyStr, type) {
    let movies = []
    let subject
    let title

    for (let key in data) {
      subject = data[key]
      title = subject.title
      if (title.length >= 0) {
        title = title.substring(0, 6) + '...'
      }
      let temp = {
        stars: formatStars(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }

    // 有类型的只取 3 个
    if (type) {
      movies = movies.slice(0, 3)
    }

    // 搜索去重
    if (keyStr === 'searchResult') {
      let idArr = [],
        repeatIdIndexArr = []
      for (let i = 0; i < movies.length; i++) {
        if (!idArr.includes(movies[i].movieId)) {
          idArr.push(movies[i].movieId)
        } else {
          repeatIdIndexArr.push(i)
        }
      }

      repeatIdIndexArr.forEach(idx => {
        movies.splice(idx, 1)
      })
    }

    let readyData = {}
    readyData[keyStr] = {
      movies: movies,
      type: type
    }
    this.setData(readyData)
  },

  // 搜索输入聚焦触发
  handleBindFocus() {
    this.setData({
      isContainerShow: false,
      isSearchPanelShow: true
    })
  },

  // 搜索输入后确认触发
  handleBindConfirm(e) {
    let text = e.detail.value
    const searchQuery = {
      title: db.RegExp({ regexp: text })
    }
    this.getMovieListData(searchQuery, 'searchResult', '')
  },

  // 关闭搜索结果
  closeSearchResult() {
    this.setData({
      isContainerShow: true,
      isSearchPanelShow: false,
      searchResult: {}
    })
  }
})
