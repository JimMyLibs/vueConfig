
export const keyValue = (list, keys, dotInsert = false) => {// 多维数组与坐标轴一一对应
    if (!list || list.length == 0) {
        list = [[{ name: '', value: 0 }]]
    };
    const newList = list.map((item1, index1) => {
        // console.log(index1,item1)
        let arr = [];
        if (dotInsert) {// 有则留存，无则清理
            item1.map((item2, index2) => {
                for (var i = 0, length = item1.length; i < length; i++) {
                    if (item1[i].name == keys[index2]) {
                        arr[index2] = { name: keys[index2], value: item1[i].value }
                        return false;
                    }
                    arr[index2] = { name: keys[index2], value: 0 }
                }
            })
        } else {// 空位插入0
            keys.map((item2, index2) => {
                for (var i = 0, length = item1.length; i < length; i++) {
                    if (item1[i].name == item2) {
                        arr[index2] = { name: item2, value: item1[i].value }
                        return false;
                    }
                    arr[index2] = { name: item2, value: 0 }
                }
            })
        }
        // console.log(index1,arr);
        return arr;
    })
    // console.log(1111,newList)
    return newList;
}

export const delLast0 = (list) => {// 删除数组后面所有是0的项
    return list.reduceRight((sum, item, index, arr) => {
        if (item.value) {
            sum.lock = true;
        }
        if (sum.lock) {
            sum.arr.push(item);
        }
        return sum;
    }, { arr: [], lock: false }).arr.reverse()
}