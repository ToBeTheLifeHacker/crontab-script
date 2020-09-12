// 集思录可转债接口
const rp = require('request-promise');
const { wxWorkToken } = require('../crontab-script-config');
const isSameDay = (first, second) => {
  if(!first || !second) {
    return false;
  }
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

const sendToWxwork = (content) => {
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
}

rp({
  uri: `https://www.jisilu.cn/data/cbnew/pre_list/?___jsl=LST___t=${Date.now()}`,
  json: true
}).then(async res => {
  if(res && Array.isArray(res.rows)) {
    const data = res.rows.slice(0, 20);
    let result = []
    data.forEach(item => {
      const { cell = {} } = item;
      const {
        apply_date: date,
        bond_nm: name,
        jsl_advise_text: advice,
      } = cell;
      if(date && name) {
        result.push({
          date,
          name,
          advice
        })
      }
    })
    result = result.filter(item => {
      return isSameDay(new Date(item.date), new Date())
    })
    try {
      if(result.length) {
        for(let i = 0; i < 2; i++ ) {
          await sendToWxwork(`可转债: ${result[i].name}, 申购建议: ${result[i].advice}`)
        }
      } else {
        await sendToWxwork(`今日无可转债!`)
      }
    } catch (e) {
      console.log('发生错误', e)
    }
  }
})