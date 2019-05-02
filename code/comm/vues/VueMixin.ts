import { Component, Vue } from "vue-property-decorator";
import { Action, Mutation } from "vuex-class";
import { ConfOptions } from "comm/utils/PublicInterface";
import Http from "comm/utils/Http";
import Native from "comm/utils/Native";
import { user, clearUser } from "comm/business/user";
import dateFormat from "comm/utils/dateFormat";

const http = new Http({});
const native = new Native();


// You can declare a mixin as the same style as components.
@Component({
  filters: {
    dateF(value?: string | number, format?: string) {
      return dateFormat(value, format)
    }
  }
})


const uploadPushInfo = () => {
  let userAgent = navigator.userAgent
  let isAndroid = userAgent.includes('Android') || userAgent.includes('Linux')
  if (isAndroid && (window as any).APP && (window as any).APP.getDeviceId()){
    const { deviceId, os } = (window as any).APP.getDeviceId();
    if (deviceId) {
      this.$post("app/user/uploadPushInfo", {
        deviceId,
        deviceType: os
      }).then((res: any) => {
        console.log('deviceId',deviceId,os)
      })
    }
  } else if ((window as any).webkit && (window as any).webkit.getDeviceId()){
    const { deviceId, os } = (window as any).webkit.getDeviceId();
    if (deviceId) {
      this.$post("app/user/uploadPushInfo", {
        deviceId,
        deviceType: os
      }).then((res: any) => {
        console.log('deviceId',deviceId,os)
      })
    }
  }
}
export default class VueMixin extends Vue {
  @Action TIP: (payload?: any) => void;
  @Mutation LOADING: (isShow?: boolean) => void;
  constructor() {
    super();
  }

  $loading(isShow = true) {
    this.LOADING(isShow);
  }

  $tip(msg?: string, time: number = 2000) {
    return new Promise((resolve, reject) => {
      this.TIP({ msg, time });
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  $user(info?: any): any {
    return user(info)
  }

  $clearUser() {
    clearUser()
  }

  $post(api: string, options?: ConfOptions) {
    return this.$fetch(api, options, "post");
  }

  $get(api: string, options?: ConfOptions) {
    return this.$fetch(api, options, "get");
  }

  $upload(api: string, options?: ConfOptions) {
    return this.$fetch(api, options, "upload");
  }

  $fetch(api: string, options: ConfOptions = {}, method = "post") {
    return new Promise((resolve, reject) => {
      let { isLoading = true, isConsole = true, isTip = true, ...other } = options;

      if (isLoading) {
        this.$loading(true);
      }
      http
        .$fetch(api, options, method)
        .then((res: any) => {
          if (isLoading) {
            this.$loading(false);
          }
          if (isConsole) {
            console.log(`${api}:`)
            console.log(res)
          }
          let { respCode, message } = res;
          if (respCode === "0000") {
            resolve({ ...res });
          } else if (respCode === "0004") {
            this.$clearUser()
            this.$router.replace('/login')
          } else {
            message = message || "系统异常，请稍后重试！";
            if (isTip) {
              this.$tip(message);
              reject({ ...res });
            } else {
              resolve({ ...res });
            }
          }
        })
        .catch((reson: any) => {
          if (isLoading) {
            this.$loading(false);
          }
          this.$tip(typeof reson === 'string' ? reson : "系统异常，请稍后重试！")
          reject(reson);
        });
    });
  }

  $getApiUrl(api: string = '', apiType?: string, apiInfo?: any): string {
    return http.getApiUrl(api, apiType, apiInfo)
  }

  $native(actionName: string, data?: any) {
    return new Promise((resolve, reject) => {
      native
        .action(actionName, data)
        .then((res: any) => {
          let { respCode } = res;
          if (respCode === "0000") {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch((reson: any) => {
          if (typeof reson !== "string") {
            reson = `调用客户端方法：${actionName}异常。`;
          }
          if (!reson.includes("not in niiwoo")) {
            this.$tip(reson);
          }
          reject(reson);
        });
    });
  }

  $setNative(fnName: string, callback: any) {
    // fnName为H5与客户端协定的函数名，callback为客户端调用H5方法后的毁掉函数
    native.setAction(fnName, callback);
  }

  $dateFormat(fmt: string) {
    const date: Date = new Date();
    const o = {
      "M+": date.getMonth() + 1, // 月份 
      "d+": date.getDate(), // 日 
      "w+": date.getDay(), // week
      "h+": date.getHours(), // 小时 
      "m+": date.getMinutes(), // 分 
      "s+": date.getSeconds(), // 秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度 
      "S": date.getMilliseconds() // 毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? ((o as any)[k]) : (("00" + (o as any)[k]).substr(("" + (o as any)[k]).length)));
    }
    return fmt;
  }
}
