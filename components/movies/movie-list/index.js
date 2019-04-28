Component({
  properties: {
    movies: Array,
    type: String
  },
  methods: {
    onMoreTap() {
      wx.navigateTo({
        url: `/pages/movies/more-movies/more-movies?type=${
          this.properties.type
        }`
      })
    }
  }
})
