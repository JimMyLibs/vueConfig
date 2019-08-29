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