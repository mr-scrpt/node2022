module.exports = (url) => {
  // console.log('test url', url.substring(1).split('/'))
  return url.substring(1).split('/')[0].toLowerCase() === 'api' ? true : false
}
