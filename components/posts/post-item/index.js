const baseCloudPath = getApp().globalData.baseCloudPath

Component({
  properties: {
    post: Object
  },
  data: {
    chatIconUrl: baseCloudPath + '/images/icon/chat.png',
    viewIconUrl: baseCloudPath + '/images/icon/view.png'
  }
})
