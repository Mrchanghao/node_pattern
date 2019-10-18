module.exports.promisify = function(callbackBaseApi) {
  return function promisified() {
    const args = [].slice.call(arguments);

    return new Promise((resolve, reject) => { 
      args.push((err, result) => {
        if(err) {
          return reject(err);
        }
        if(arguments.length <= 2) {
          resolve(result);
        } else {
          resolve([].slice.call(arguments, 1));
        }
      });
      callbackBaseApi.apply(null, args)
    })
  }
}