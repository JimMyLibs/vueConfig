const single2doubleDeep = (arr)=>{
    return arr.reduce((sum, item, index, arr)=>{
        if(arr.length%2==1 && index==arr.length-1){
            sum.push([arr[index]])
        }else if(index%2==1){
            sum.push([arr[index-1],arr[index]])
        }		
        return sum;
    },[])
}
const makeArray = (length)=>{
    return Array.from(Array(100), (v,k) => k);
    // return Array.from({length:100}, (v,k) => k);
    // return Array.from(new Array(length)).map((item,index)=>index);
}