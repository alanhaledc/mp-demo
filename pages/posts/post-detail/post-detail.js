const postsData = require('../../../data/posts-data.js')
// 获取全局 App
const app = getApp()

Page({
  data: {
    isPlaying: false,
    currentPostId: null,
    postData: {}
  },

  onLoad: function(options) {
    // 获取从路由中传来的id值
    const postId = options.id

    // id赋值给变量
    this.setData({
      currentPostId: postId
    })

    // 通过id值取得对应数据
    const postData = postsData.postList[postId]
    this.setData({
      postData: postData
    })

    // 初始化收藏状态 获取缓存数据
    this.initPostsCollected(postId)

    // 把当前页面的播放状态和id保存到全局变量中， 不会因为退出当前页面而丢失
    if (
      app.globalData.g_isPlaying &&
      app.globalData.g_currentPostId === postId
    ) {
      this.setData({
        isPlaying: true
      })
    }

    this.setAudioMonitor()
  },

  /**
   * 初始化收藏状态 获取缓存数据
   */
  initPostsCollected: function(postId) {
    // 加载后获取缓存
    const postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      const isPostCollected = postsCollected[postId]
      // 赋值给变量
      this.setData({
        isCollected: isPostCollected
      })
    } else {
      const postsCollected = {}
      // 初始值为false
      postsCollected[postId] = false
      // 存储
      wx.setStorageSync('posts_collected', postsCollected)
    }
  },

  /**
   * 监听音乐播放状态
   */
  setAudioMonitor: function() {
    const that = this

    // 公共开关和页面开关同步
    // 监听音乐播放
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        isPlaying: true
      })
      // 更新全局变量数据
      app.globalData.g_isPlaying = true
      app.globalData.g_currentPostId = that.data.currentPostId
    })

    // 监听音乐暂停
    wx.onBackgroundAudioPause(function() {
      that.setData({
        isPlaying: false
      })
      // 更新全局变量数据
      app.globalData.g_isPlaying = false
      app.globalData.g_currentPostId = null
    })

    // 监听音乐停止
    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlaying: false
      })
      // 更新全局变量数据
      app.globalData.g_isPlaying = false
      app.globalData.g_currentPostId = null
    })
  },

  /**
   * 播放音乐
   */
  onMusicTop: function() {
    let isPlaying = this.data.isPlaying
    const currentPostId = this.data.currentPostId
    const postData = postsData.postList[currentPostId]
    if (isPlaying) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlaying: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({
        isPlaying: true
      })
    }
  },

  /**
   * 收藏文章或取消收藏
   */
  onCollectionTap: function() {
    // 异步获取收藏缓存
    // this.getPostsCollectAsync();

    // 同步获取收藏缓存
    this.getPostsCollectSync()
  },

  /**
   * 同步获取收藏缓存
   */
  getPostsCollectSync: function() {
    const postsCollected = wx.getStorageSync('posts_collected')
    // 取得当前页面文章收藏数据(是否收藏)
    let isPostCollected = postsCollected[this.data.currentPostId]
    // 点击后需要取反(收藏变不收藏，不收藏变收藏)
    isPostCollected = !isPostCollected
    // 更新点击后的收藏状态
    postsCollected[this.data.currentPostId] = isPostCollected

    // 交互
    // 显示模态弹窗 不建议
    // this.showModel(postsCollected, postCollected);

    // 显示消息提示框
    this.showToast(postsCollected, isPostCollected)
  },

  /**
   * 异步获取收藏缓存（与同步进行对比，小程序异步用得比较少，容易出问题）
   */
  getPostsCollectAsync: function() {
    const that = this
    wx.getStorage({
      key: 'posts_collected',
      success: function(res) {
        const postsCollected = res.data
        let postCollected = postsCollected[that.data.currentPostId]
        postCollected = !postCollected
        postsCollected[that.data.currentPostId] = postCollected
        that.showToast(postsCollected, postCollected)
      }
    })
  },

  /**
   * 分享文章
   */
  onShareTap: function() {
    this.showActionSheet()
  },

  /**
   * 显示分享操作菜单
   */
  showActionSheet: function() {
    const itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function(res) {
        wx.showModal({
          title: `用户${itemList[res.tapIndex]}`,
          content: '现在小程序无法实现分享功能，什么时候能支持呢？'
        })
      }
    })
  },

  /**
   * 显示消息提示框
   */
  showToast: function(postsCollected, isPostCollected) {
    // 同时更新缓存
    wx.setStorageSync('posts_collected', postsCollected)
    // 同时更新收藏数据
    this.setData({
      isCollected: isPostCollected
    })
    // 根据收藏状态提示消息
    wx.showToast({
      title: isPostCollected ? '收藏成功' : '取消成功',
      duration: 500
    })
  },

  /**
   * 显示模态弹窗 (和消息提示框对比)
   * @param postsCollected
   * @param postCollected
   */
  showModel: function(postsCollected, isPostCollected) {
    const that = this
    wx.showModal({
      title: '收藏',
      content: isPostCollected ? '是否收藏该文章' : '是否取消收藏该文章',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function(res) {
        if (res.confirm) {
          // 更新缓存
          wx.setStorageSync('posts_collected', postsCollected)

          // 更新变量数据 注意this指向
          that.setData({
            isCollected: isPostCollected
          })
        }
      }
    })
  }
})
