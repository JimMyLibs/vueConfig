// 项目目录名
const PROJECT_DIR_NAME = process.env.PROJECT_DIR_NAME;

// 获取url参数
export function getQueryString(name: string, url = location.href) {
  let queryJson: any = {};
  let matchSearch = url.match(/\?[^#/]+/);
  let search = matchSearch ? matchSearch[0].replace("?", "") : "";
  if (search) {
    let queryArr = search.split("&");
    queryArr.forEach((item: string) => {
      let eachQuery = item.split("=");
      queryJson[eachQuery[0]] = eachQuery[1];
    });
  }
  if (typeof name === "string" && name.trim() !== "") {
    return queryJson[name];
  }
  return queryJson;
}

// json数据转换为params字符串
export function jsonToParams(obj: any) {
  // obj为非空对象，则转换为params字符串
  if (typeof obj === "object" && obj !== null) {
    let arr: string[] = [];
    Object.keys(obj).forEach(key => {
      let val = obj[key];
      if (typeof val === "object") {
        arr.push(`${key}=${JSON.stringify(val)}`);
      } else {
        arr.push(`${key}=${val}`);
      }
    });
    return arr.join("&");
  } else {
    // 如果已经是字符串则返回，undefined则返回默认空字符串
    return obj || "";
  }
}

// 获取当前主机地址
// 假设当前地址为：
// https://test.niiwoo.com:5006/h5/activity/inviting2/index.html#/activityRegister
// output:  https://test.niiwoo.com:5006
export function getLocalhost() {
  let { protocol, host } = urlFormat();
  return `${protocol}//${host}`;
}

// url添加参数或者替换hash，获取新的url
// input：
/*
{
  url:  'https://test.niiwoo.com:5006/h5/index.html?name=lixiong#/index'
  hash: '/question'
  params: {
    sex: '1'
  }
}
 */
// output:
// 'https://test.niiwoo.com:5006/h5/index.html?name=lixiong&sex=1#/question'

// 添加某个url的参数或者替换hash值，得到新的url
// export function getChangeUrl(options) {
//   let { url, params, hash } = options;
//   let { protocol, host, pathname, search, hash: oldHash } = urlFormat(url);
//   hash = hash ? `#${hash}` : oldHash;
//   params = jsonToParams(params);
//   if (params) {
//     search = search.startsWith("?") ? `${search}&${params}` : `?${params}`;
//   }
//   return `${protocol}//${host}${pathname}${search}${hash}`;
// }

/**
 * [getUrlDir 获取url到某一目录的路径]
 * @param  {[string]} [dirname=PROJECT_DIR_NAME.split('/'] [需要获取到某个目录名，默认为当前项目名]
 * @return {[string]}                                       获取失败则返回空
 */
export function getUrlDir(
  dirname = PROJECT_DIR_NAME.split("/")[1],
  url = location.href
) {
  let reg = new RegExp(`.+\\/${dirname}\\/`);
  let match = url.match(reg);
  return match ? match[0] : `${location.origin}/`;
}

// 获取当前href到目录部分字符串
// https://test.niiwoo.com:5006/h5/demo/index.html#/index
// https://test.niiwoo.com:5006/h5/demo/
// export function getHostDir() {
//   let { protocol, host, pathname } = urlFormat();
//   pathname = pathname.match(/\/[\w/]*\//);
//   pathname = pathname ? pathname[0] : "/";
//   return `${protocol}//${host}${pathname}`;
// }

// 对hash值转换为绝对地址的处理
// http开头的绝对地址，则直接返回
// /开头的hash地址，则转换为对应绝对地址(/index => url#/index)
// export function getRealLink(path = location.href) {
//   // 传入绝对路径，则直接返回
//   if (path.startsWith("http")) {
//     return path;
//   } else if (path.startsWith("/")) {
//     // 替换当前url的hash值，返回新地址
//     return getChangeUrl({ hash: path });
//   } else {
//     throw new Error(`调用getRealLink方法的path：${path}格式有误`);
//   }
// }

// 输出格式化url
// input：'https://test.niiwoo.com:5006/h5/index.html?name=lixiong#/index'
// output:
/*
{
    "protocol": "https:",
    "host": "test.niiwoo.com:5006",
    "pathname": "/h5/index.html",
    "search": "?name=lixiong",
    "hash": "#/index"
}
 */
// 输出格式化url
export function urlFormat(url = location.href) {
  if (url === location.href) {
    return {
      protocol: location.protocol,
      host: location.host,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash
    };
  }
  let matchProtocol = url.match(/^http\w?:/);
  let protocol = matchProtocol ? matchProtocol[0] : "";
  let noProtocolUrl = url.replace(protocol, "").replace("//", "");
  let host = noProtocolUrl.split("/")[0];
  let noHostUrl = noProtocolUrl.replace(host, "");
  let matchSearch = noHostUrl.match(/\?[^#]+/);
  let search = matchSearch ? matchSearch[0] : "";
  let matchHash = noHostUrl.match(/#\/[^?]+/)
  let hash = matchHash ? matchHash[0] : "";
  let mathPath = noHostUrl
    .replace(search, "")
    .replace(hash, "")
    .match(/\/[^?#]*/);
  let pathname = mathPath ? mathPath[0] : "";

  return { protocol, host, pathname, search, hash };
}
