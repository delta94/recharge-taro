import Taro from '@tarojs/taro'
import * as api from './api.js'
import { setGlobalData } from './globalData'

export function login () {
  Taro.login({
    success: async function (res) {
      if (res.code) {
        const { result: isSubscribe } = await api.login(res.code)
        setGlobalData('isSubscribe', isSubscribe)
        Taro.reLaunch({ url: '/pages/index/index' })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}

export function wechatPay ({ nonceStr, paySign, signType, payPackage, timeStamp }) {
  return new Promise((resolve, reject) => {
    console.log({ nonceStr, paySign, signType, payPackage, timeStamp }, 123)
    Taro.requestPayment({
      timeStamp,
      nonceStr,
      package: payPackage,
      signType,
      paySign,
      success () {
        Taro.requestSubscribeMessage({
          tmplIds: ['8Q9-cY0jD1FTK59AqcDcGSKj5ZBC5uw1zdDcglsqyRA'],
          success: function (res) {
            resolve(res)
          },
          fail (err) {
            reject(err)
          }
        })
      },
      fail (err) {
        reject(err)
      }
    })
  })
}
