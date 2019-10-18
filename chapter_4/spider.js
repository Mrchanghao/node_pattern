const utilities = require('./utilities');
const request = utilities.promisify(require('request'))
const mkdirp = utilities.promisify(require('mkdirp'));
const fs = require('fs');
const readFile = utilities.promisify(fs.readFile);
const writeFile = utilities.promisify(fs.writeFile);
const path = require('path')
const TaskQueue = require('./QueueMethod');
const downloadedQueue = new TaskQueue(2);
// 콜백 기반 함수를 프로미스화 했음....

function download(url, filename) {
  console.log(`download ${url}`);

  let body;
  return request(url)
    .then(res => {
      body = res.body;
      return mkdirp(path.dirname(filename));
    })
    .then(() => writeFile(filename, body))
    .then(() => {
      console.log(`downLoaded and saved ${url}`)
      return body;
    });
  
};

function spider (url, nesting) {
  let filename = utilities.urlToFilename(url);
  return readFile(filename, 'utf8')
    .then((body) => (spiderLinks(url, body, nesting)),
    (err) => {
      if(err.code !== 'ENOENT') {
        throw err;
      }
      return download(url, filename)
        .then(body => spiderLinks(url, body, nesting));
    }
    )
};

function spiderLinks(currentUrl, body, nesting) {
  if(nesting === 0) {
    return Promise.resolve();
  }

  const links = utilities.getPageLinks(currentUrl, body);

  if(links.length === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let completed = 0;
    let errored = false;
    links.forEach(link => {
      let task = () => {
        return spider(link, nesting - 1)
          .then(() => {
            if(++completed === links.length) {
              resolve();
            }
          })
          .catch(() => {
            if(!errored) {
              errored = true;
              reject();
            }
          })
      };
      downloadedQueue.pushTask(task);
    })
  })

  // const promises = links.map(link => spider(link, nesting - 1));

  // return Promise.all(promises);
}


spider(process.argv[2], 1).then(() => console.log('다운로드 완료'))
  .catch(err => console.error(err.message));