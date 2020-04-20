const app = getApp()
const db = wx.cloud.database()
let postsData
db.collection('posts')
  .get()
  .then(res => {
    postsData = res.data[0]
  })

Page({
  data: {
    isPlaying: false,
    currentPostId: null,
    postData: {},
    isCollected: false,
    musicStopIconUrl:
      'cloud://test1-81dcef.7465-test1-81dcef/images/music/music-stop.png',
    musicStartIconUrl:
      'cloud://test1-81dcef.7465-test1-81dcef/images/music/music-start.png'
  },

  onLoad(options) {
    const postId = options.id
    this.setData({ currentPostId: postId })
    const postData = postsData.postList[postId]
    this.setData({
      postData: postData
    })

    this.initPostsCollected(postId)

    // 把当前页面的播放状态和 id 保存到全局变量中，不会因为退出当前页面而丢失
    if (
      app.globalData.g_isPlaying &&
      app.globalData.g_currentPostId === postId
    ) {
      this.setData({ isPlaying: true })
    }

    this.setAudioMonitor()
  },

  // 初始化收藏状态 获取缓存数据
  initPostsCollected(postId) {
    const postsCollected = wx.getStorageSync('posts_collected')

    if (postsCollected && postsCollected[postId]) {
      const isPostCollected = postsCollected[postId]
      this.setData({ isCollected: isPostCollected })
    } else {
      const postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync('posts_collected', postsCollected)
    }
  },

  // 监听音乐播放状态
  setAudioMonitor() {
    wx.onBackgroundAudioPlay(() => {
      this.setData({ isPlaying: true })

      app.globalData.g_isPlaying = true
      app.globalData.g_currentPostId = this.data.currentPostId
    })

    // 监听音乐暂停
    wx.onBackgroundAudioPause(() => {
      this.setData({ isPlaying: false })

      app.globalData.g_isPlaying = false
      app.globalData.g_currentPostId = null
    })

    // 监听音乐停止
    wx.onBackgroundAudioStop(() => {
      this.setData({ isPlaying: false })

      app.globalData.g_isPlaying = false
      app.globalData.g_currentPostId = null
    })
  },

  // 播放音乐
  playMusic() {
    let isPlaying = this.data.isPlaying
    const currentPostId = this.data.currentPostId
    const postData = postsData.postList[currentPostId]
    if (isPlaying) {
      wx.pauseBackgroundAudio()
      this.setData({ isPlaying: false })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({ isPlaying: true })
    }
  },

  // 设置文章收藏状态
  setPostCollection() {
    const postsCollected = wx.getStorageSync('posts_collected')
    let isPostCollected = postsCollected[this.data.currentPostId]
    isPostCollected = !isPostCollected

    postsCollected[this.data.currentPostId] = isPostCollected
    this.showToast(postsCollected, isPostCollected)
  },

  // 设置文章收藏状态
  setPostCollectionAsync() {
    wx.getStorage({
      key: 'posts_collected',
      success: res => {
        const postsCollected = res.data
        let postCollected = postsCollected[this.data.currentPostId]
        postCollected = !postCollected
        postsCollected[this.data.currentPostId] = postCollected
        this.showToast(postsCollected, postCollected)
      }
    })
  },

  // 分享文章
  showPost() {
    this.showActionSheet()
  },

  // 显示分享操作菜单
  showActionSheet() {
    const itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function (res) {
        wx.showModal({
          title: `用户${itemList[res.tapIndex]}`,
          content: '现在小程序无法实现分享功能，什么时候能支持呢？'
        })
      }
    })
  },

  //  显示消息提示框
  showToast(postsCollected, isPostCollected) {
    wx.setStorageSync('posts_collected', postsCollected)
    this.setData({ isCollected: isPostCollected })
    wx.showToast({
      title: isPostCollected ? '收藏成功' : '取消成功',
      duration: 500
    })
  },

  // 显示模态弹窗
  showModel(postsCollected, isPostCollected) {
    wx.showModal({
      title: '收藏',
      content: isPostCollected ? '是否收藏该文章' : '是否取消收藏该文章',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: res => {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected)
          this.setData({ isCollected: isPostCollected })
        }
      }
    })
  }
})
