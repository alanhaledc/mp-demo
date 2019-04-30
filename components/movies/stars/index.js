const baseCloudPath = getApp().globalData.baseCloudPath

Component({
  properties: {
    stars: Array,
    score: Number
  },
  data: {
    starIconUrl: baseCloudPath + '/images/icon/star.png',
    noneStatIconUrl: baseCloudPath + '/images/icon/none-star.png'
  }
})
