function closeToZero(ts){
    if(!ts.length){
        return 0
    }
    let close = ts[0]
    ts.forEach(elem => {
        const value = Math.abs(elem)
        if(value < close){
            close = elem
        }
    })
    return close
}