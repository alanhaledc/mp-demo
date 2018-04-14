/**
 * 将表示星星数的字符串转化为数组 '35' => [1,1,1,0,0] '50' => [1,1,1,1,1]
 * @param stars
 * @return {Array}
 */
const formateStars = (stars) => {
  const num = stars.substring(0, 1);
  let arr = [];
  for (let i = 0; i < 5; i++) {
    if (i< num) {
      arr.push(1)
    } else {
      arr.push(0)
    }
  }
  return arr;
};

/**
 * 网络请求
 * @param url
 * @param cb
 */
const http = (url, cb) => {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'Content-Type': 'json'
    },
    success: function (res) {
      cb(res.data)
    },
    fail: function (error) {
      console.log(error)
    }
  })
};

/**
 * 处理演员
 * @param casts
 * @return {string}
 */
const formateCasts = (casts) => {
  const temArr = [];
  casts.forEach((item) => {
    temArr.push(item.name)
  });
  return temArr.join('/');
};

/**
 * 处理演员信息
 * @param casts
 * @return {Array}
 */
const formateCastsInfo = (casts) => {
  const arr = [];
  casts.forEach((item) => {
    const obj = {};
    obj.avatar = item.avatars ? item.avatars.large: '';
    obj.name = item.name;
    arr.push(obj);
  });
  return arr;
};


module.exports = {
  formateStars: formateStars,
  http: http,
  formateCasts: formateCasts,
  formateCastsInfo: formateCastsInfo
};
