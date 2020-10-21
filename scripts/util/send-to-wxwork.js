const rp = require('request-promise');
/**
 * 
 * @param {*} content 要发送的内容
 * @param {*} wxWorkTokens 微信 tokens 数组
 */

const sendToWxwork = (content, wxWorkTokens) => {
  if(!Array.isArray(wxWorkTokens)) {
    throw new Error(`tokens 必须是数组，但目前是: ${typeof wxWorkTokens}`)
  }
  const promises = wxWorkTokens.map(wxWorkToken => {
    return rp({
      method: 'POST',
      uri: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${wxWorkToken}`,
      body: {
        msgtype: "markdown",
        markdown: {
          content,
        }
      },
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    })
  })
  return Promise.all(promises)
}

module.exports = sendToWxwork;