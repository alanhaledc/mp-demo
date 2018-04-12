const postsData = require('../../../data/posts-data.js');

Page({
  data: {},

  onLoad: function (options) {
    const postId = options.id;
    // 当前id赋值给变量
    this.setData({
      currentPostId: postId
    });
    const postData = postsData[postId];
    this.setData(postData);

    // 加载后获取缓存
    const postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      const postCollected = postsCollected[postId];
      // 赋值给变量
      this.setData({
        collected: postCollected
      })
    } else {
      const postsCollected = {};
      // 初始值为false
      postsCollected[postId] = false;
      // 存储
      wx.setStorageSync('posts_collected', postsCollected)
    }
  },

  /**
   * 收藏
   */
  onCollectionTap: function () {
    // 异步获取收藏缓存
    // this.getPostsCollectAsync();

    // 同步获取收藏缓存
    this.getPostsCollectSync();


  },

  /**
   * 同步获取收藏缓存
   */
  getPostsCollectSync: function () {
    const postsCollected = wx.getStorageSync('posts_collected');
    let postCollected = postsCollected[this.data.currentPostId];
    // 取反
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;

    // 交互
    // 显示模态弹窗 不建议
    // this.showModel(postsCollected, postCollected);

    // 显示消息提示框
    this.showToast(postsCollected, postCollected);
  },

  /**
   * 异步获取收藏缓存（与同步进行对比，小程序异步用得比较少，容易出问题）
   */
  getPostsCollectAsync:function () {
    const that = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function (res) {
        const postsCollected = res.data;
        let postCollected = postsCollected[that.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        that.showToast(postsCollected, postCollected);
      }
    })
  },

  /**
   * 分析
   */
  onShareTap: function () {
    this.showActionSheet();
  },

  /**
   * 显示操作菜单
   */
  showActionSheet: function () {
    const itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博',
    ];
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

  /**
   * 显示消息提示框
   */
  showToast: function (postsCollected, postCollected) {
    // 更新缓存
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新变量数据
    this.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 500,
    })
  },

  /**
   * 显示模态弹窗
   * @param postsCollected
   * @param postCollected
   */
  showModel: function (postsCollected, postCollected) {
    const that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '是否收藏该文章':'是否取消收藏该文章',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function (res) {
        if (res.confirm) {
          // 更新缓存
          wx.setStorageSync('posts_collected', postsCollected);

          // 更新变量数据 注意this指向
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  }
});