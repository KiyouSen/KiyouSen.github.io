
function array2typed(arr){
    let tarr = []
    arr.forEach(a => {
      tarr.push(new Float32Array(a))
    })
    return tarr
}

function typed2arr(tarr){
    arr = []
    tarr.forEach(a => {
      arr.push(Array.prototype.slice.call(a))
    })
    return arr
}