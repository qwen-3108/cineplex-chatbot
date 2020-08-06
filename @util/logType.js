module.exports = function logType(obj, n){
    let tabTimes = '';
    for(var i = 0; i < n; i++){
        tabTimes += '\t';
    }
    for(var key in obj){
        const value = obj[key];
        if(value instanceof Date ){
          console.log(tabTimes, `${key}: ${value.toLocaleString()} (Date)`);
        }else if(Array.isArray(value)){
            console.log(tabTimes, `${key}: ${value} (Array)`)
        }else if(typeof value === 'object' && value !== null){
            console.log(tabTimes, `${key}: {`);
            logType(value, n+1);
            console.log(tabTimes, '}');
        }else{
            console.log(tabTimes, `${key}: ${value} (${typeof value})`)
        }
    }
}
