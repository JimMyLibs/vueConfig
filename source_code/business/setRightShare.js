import getShareInfo from 'business/getShareInfo'
import native from 'utils/Native'
import wechat from 'utils/Wechat'
import {getQueryString} from 'utils/url'

export default function(shareCode, type = [
  0, 1
], isAuth = false, title = document.title) {
  getShareInfo(shareCode).then(res => {
    let {
      sharetitle: title,
      sharecontent: desc,
      shareimageurl: imgUrl,
      jumpurl,
    } = res.data

    let shareCode = getQueryString('shareCode')
    let paramsStr = jumpurl.includes('?') ? '&' : '?'
    let link = `${jumpurl}${paramsStr}shareCode=${shareCode}`

    wechat.setShareInfo({
      title,
      desc,
      imgUrl,
      link
    }, isAuth)

    native.setAction('clickRightTop', function() {
      native.share({
        type,
        title,
        desc,
        imgUrl,
        link
      }, isAuth)
    })

    native.action('setNav', {
      isShow: true,
      title: title,
      type: 1,
      rightText: '分享',
      rightFnName: 'clickRightTop'
    })

  })
}
