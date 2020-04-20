import {
  formatStars,
  formatCasts,
  formatCastsInfo
} from '../../../util/index.js'

const db = wx.cloud.database()

Page({
  data: {
    movie: {}
  },

  onLoad(options) {
    const movieId = options.id

    db.collection('movies')
      .where({
        id: Number(movieId)
      })
      .limit(1)
      .get()
      .then(res => {
        this.processDoubanData(res.data[0])
      })
  },

  // 提取数据
  processDoubanData(data) {
    const director = {
      avatar: '',
      name: ''
    }

    if (data.directors[0] !== null) {
      if (data.directors[0].avatar !== null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name
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
      stars: formatStars(data.rating.stars),
      score: data.rating.average,
      casts: formatCasts(data.casts),
      castsInfo: formatCastsInfo(data.casts),
      summary: data.summary ? data.summary : '暂无简介'
    }

    this.setData({ movie: movie })
  },

  // 图片预览
  viewMoviePostImg(e) {
    const url = e.currentTarget.dataset.src

    wx.previewImage({
      current: url,
      urls: [url]
    })
  }
})
