// 集思录可转债接口
const rp = require('request-promise');
const { jslKzz } = require('../crontab-script-config');
const sendToWxwork = require('./util/send-to-wxwork');
const { wxWorkTokens } = jslKzz;

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

    // 过滤出当天的信息
    result = result.filter(item => {
      return isSameDay(new Date(item.date), new Date())
    })

    const messages = [];

    try {
      if(result.length) {
        for(let i = 0; i < result.length; i++ ) {
          messages.push(`可转债: ${result[i].name}, 申购建议: ${result[i].advice}`);
        }
      } else {
        messages.push(`今日无可转债!`)
      }

      const message = messages.join('\n');

      await sendToWxwork(message, wxWorkTokens)
    } catch (e) {
      console.log('发生错误', e)
    }
  }
})