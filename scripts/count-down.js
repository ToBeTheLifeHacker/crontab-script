// 倒计时脚本

const { countDown } = require('../crontab-script-config');
const sendToWxwork = require('./util/send-to-wxwork');
const { wxWorkTokens } = countDown;

const INVALID_DATE_STR = 'Invalid Date';
const ONE_DAY_MILLISECONDS = 24 * 3600 * 1000; // 一天多少毫秒

/**
 * 统一起始日期，目标日期为当天的 0 点，来计算相差天数
 * @param {*} currentDate 起始日期
 * @param {*} targetDate 目标日期
 * @param {*} message 提示信息
 */

const getCoundDownStr = (currentDate, targetDate, message = `距离 ${targetDate} 还有 day 天 `) => {
  if(!(currentDate instanceof Date)) {
    currentDate = new Date(currentDate)
    if(currentDate.toString() === INVALID_DATE_STR) {
      console.log(`[${message}]: currentDate is not valid Date or date str`);
      return `[${message}]: currentDate is not valid Date or date str`
    }
  }
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  if(!(targetDate instanceof Date)) {
    targetDate = new Date(targetDate)
    if(targetDate.toString() === INVALID_DATE_STR) {
      console.log(`[${message}]: targetDate is not valid Date or date str`);
      return `[${message}]: targetDate is not valid Date or date str`
    }
  }
  targetDate.setHours(0);
  targetDate.setMinutes(0);
  targetDate.setSeconds(0);
  targetDate.setMilliseconds(0);

  if(currentDate > targetDate) {
    console.log(`[${message}]: 当前日期已大于目标日期, 倒计时结束`)
    return `[${message}]: 当前日期已大于目标日期, 倒计时结束`
  }

  const time1 = currentDate.getTime();
  const time2 = targetDate.getTime();

  const diffMilliseconds = time2 - time1;

  const day = Math.floor(diffMilliseconds / ONE_DAY_MILLISECONDS);
  return message.replace(/day/, day)
}

async function main() {
  const messages = [
    getCoundDownStr(new Date(), '2021-01-01', '距离 2021 年元旦还有 day 天'),
    getCoundDownStr(new Date(), '2021-02-12', '距离 2021 年春节还有 day 天')
  ]
  
  const message = messages.join('\n');
  try {
    await sendToWxwork(message, wxWorkTokens)
  } catch (e) {
    console.log('发生错误', e)  
  }
}

main()
