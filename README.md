# 定时脚本，将消息推送到企业微信群

## 1. 使用

根目录新建 `crontab-script-config.js`, 将企业微信机器人 token 填入:  

```js
module.exports = {
  wxWorkToken: ' 企业微信机器人 token '
}
```

## 2. 脚本列表
1. 集思录可转债接口 `scripts/jsl-kzz.js`
