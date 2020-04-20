// 将表示星星数的字符串转化为数组
// e.g '35' => [1, 1, 1, 0 ,0] '50' => [1, 1, 1, 1, 1]
export const formatStars = stars => {
  const num = stars.substring(0, 1)
  let arr = []
  for (let i = 0; i < 5; i++) {
    if (i < num) {
      arr.push(1)
    } else {
      arr.push(0)
    }
  }
  return arr
}

// 规范演员
export const formatCasts = casts => {
  const temArr = []
  casts.forEach(item => {
    temArr.push(item.name)
  })
  return temArr.join('/')
}

// 规范演员信息
export const formatCastsInfo = casts => {
  const arr = []
  casts.forEach(item => {
    const obj = {}
    obj.avatar = item.avatars ? item.avatars.large : ''
    obj.name = item.name
    arr.push(obj)
  })
  return arr
}

// module.exports = {
//   formatStars,
//   formatCasts,
//   formatCastsInfo
// }
