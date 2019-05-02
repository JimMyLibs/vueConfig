
// 生成不重复签名
export function createRandomId(): string {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + S4() + S4()
}

// 非生产环境下console才生效
export function p(...something: any[]) {
  console.log(...something)
}


/**
 * 深拷贝
 * @param obj 
 */
export function deepCopy(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.reduce((pre, current) => {
      pre.push(deepCopy(current));
      return pre;
    }, []);
  } else if (typeof obj === "object") {
    return Object.keys(obj).reduce((pre: any, current: any) => {
      if (obj.hasOwnProperty(current)) {
        pre[current] = deepCopy(obj[current]);
      }
      return pre;
    }, {});
  } else {
    return obj;
  }
}

// 深合并
export function deepAssign(...objs: any[]): any {
  return objs.reduce((pre, next) => {
    Object.keys(next).forEach(key => {
      if (next.hasOwnProperty(key)) {
        // 忽略原型上的属性
        let nextValue = next[key];
        if (typeof nextValue === "object") {
          if (pre.hasOwnProperty(key)) {
            let preValue = pre[key];
            if (Array.isArray(nextValue)) {
              // array replace
              pre[key] = deepCopy(nextValue);
            } else {
              if (Array.isArray(preValue)) {
                pre[key] = deepCopy(nextValue);
              } else if (typeof preValue === "object") {
                pre[key] = deepAssign(preValue, nextValue);
              } else {
                pre[key] = deepCopy(nextValue);
              }
            }
          } else {
            pre[key] = deepCopy(nextValue);
          }
        } else {
          pre[key] = nextValue;
        }
      }
    });
    return pre;
  }, {});
}
