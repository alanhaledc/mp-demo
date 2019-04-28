const util = require('../../../utils/util.js')
const app = getApp()
const doubanBase = app.globalData.g_doubanBase

Page({
  data: {
    movie: {}
  },

  onLoad(options) {
    const movieId = options.id
    const detailUrl = `${doubanBase}/v2/movie/subject/${movieId}`
    util.http(detailUrl, this.processDoubanData)
  },

  /**
   * 提取数据
   * @param data
   */
  processDoubanData(data) {
    // 导演字段处理
    let director = {
      avatar: '',
      name: ''
      // id:''
    }

    if (data.directors[0] !== null) {
      if (data.directors[0].avatar !== null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name
      // director.id = data.directors[0].id
    }

    const movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries.join('/'),
      title: data.original_title,
      originalTitle: data.original_title,
      director: director,
      wishCount: data.wish_count,
      reviewsCount: data.reviews_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join('、'),
      stars: util.formatStars(data.rating.stars),
      score: data.rating.average,
      casts: util.formatCasts(data.casts),
      castsInfo: util.formatCastsInfo(data.casts),
      summary: data.summary ? data.summary : '暂无简介'
    }

    this.setData({
      movie: movie
    })
  },

  /**
   * 图片预览(电影海报和影人)
   * @param e
   */
  viewMoviePostImg(e) {
    const url = e.currentTarget.dataset.src

    wx.previewImage({
      current: url,
      urls: [url]
    })
  }
})
