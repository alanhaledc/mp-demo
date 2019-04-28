Component({
  properties: {
    movie: Object
  },
  methods: {
    /**
     * 跳转到电影详情页
     */
    onMovieTap() {
      wx.navigateTo({
        url: `/pages/movies/movie-detail/movie-detail?id=${this.properties.movie.movieId}`
      })
    }
  }
})
