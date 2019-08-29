// cut one-dimensional arrays into two-dimensional arrays
// unitNum: number of units
const cutArray = (arr,unitNum=2)=>{
    return arr.reduce((sum, item, index, arr)=>{	
		const curStep = arr.slice(sum.length*unitNum,(sum.length+1)*unitNum);
        !!curStep.length&&sum.push(curStep)
        return sum;
    },[])
}
const makeArray = (length)=>{
    return Array.from(Array(100), (v,k) => k);
    // return Array.from({length:100}, (v,k) => k);
    // return Array.from(new Array(length)).map((item,index)=>index);
}
// 
const hasRepeatKey = (arr1,arr2)=>{
    const setLength = [...new Set([...arr1,...arr2])].length;
    const sumLength = arr1.length + arr2.length;
    return setLength < sumLength;
}
const getRepeatItems = function(){
    const arr = [...arguments].reduce((sum,item)=>{
        sum = [...sum,...item]
        return sum;
    },[])
    let obj = {};
    arr.map(item=>{
        obj[item] = ++obj[item] || 0;
    })
    const repeatItems = Object.keys(obj).filter(item=>obj[item]>0);
    return {
        repeatCount: obj,
        repeatItems,
    }
}