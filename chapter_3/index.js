const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');
const TaskQueue = require('./QueueMethod');
const async = require('async');
const downloadQueue = new TaskQueue(2); // 동시 진행 작업이 2개 일때

function download(url, filename, callback) {
  console.log(`downloaded ${url}`);

  let body;

  async.series([
    callback => {
      request(url, (err, res, resBody) => {
        if(err) {
          return callback(err);
        }
        body = resBody;
        callback();
      })
    },
    mkdirp.bind(null, path.dirname(filename)),
    callback => {
      fs.writeFile(filename, body, callback);
    }
  ], err => {
    if(err) {
      return callback(err);
    }
    console.log(`download and save ${url}`);
    callback(null, body);
  })
}

function spider (url, nesting,  callback) {
  const filename  = utilities.urlToFilename(url);
  fs.readFile(filename, 'utf8', (err, body) =>  {
    if(err) {
      if(err.code !== 'ENOENT') {
        return  callback(err);
      }

      return  download(url, filename, (err, body) =>  {
        if(err) {
          return  callback(err);
        }
        spiderLinks(url,  body, nesting,  callback);
      })
    };

    spiderLinks(url,  body, nesting,  callback)
  })
  
};


// new version 
function spiderLinks(currentUrl, body, nesting, callback) {
  if(nesting === 0) {
    return process.nextTick(callback);
  }
  const links = utilities.getPageLinks(currentUrl, body);
  if(links.length === 0) {
    return process.nextTick(callback);
  };
  let completed = 0, hasErrors = false;

  async.eachSeries(links, (link, callback) => {
    spider(link, nesting - 1, callback)
  }, callback);

  // links.forEach(link => {
  //   downloadQueue.pushTask(done => {
  //     spider(link, nesting - 1, err => {
  //       if(err) {
  //         hasErrors = true;
  //         return callback(err);
  //       }

  //       if(++completed === links.length && !hasErrors) {
  //         callback();
  //       };
  //       done();
  //     })
  //   })
  // })
}



spider(process.argv[2], (err, filename, downloaded) => {
  if(err) {
    console.log(err);
  } else if(downloaded) {
    console.log(`completed the download of ${filename}`)
  } else  {
    console.log(`${filename} downloaded`);
  }
})