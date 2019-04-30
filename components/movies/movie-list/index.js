const baseCloudPath = getApp().globalData.baseCloudPath

Component({
  properties: {
    movies: Array,
    type: String
  },
  data: {
    arrowRightIconUrl: baseCloudPath + '/images/icon/arrow-right.png'
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
