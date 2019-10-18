const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

const eeInstance = new EventEmitter();
// on 
function findPattern(files, regex) {
  const emitter = new EventEmitter();
  files.forEach(file => {
    fs.readFile(file, 'utf8', (err, content) => {
      if(err) {
        return emitter.emit('error', err);
      }
      emitter.emit('fileread', file);
      let match;
      if(match = content.match(regex)) {
        match.forEach(elem => emitter.emit('found', file, elem))
      }
    })
  })
  return emitter;
}

// 3가지 이벤트
// error, fileread, found
findPattern(['data.txt', 'package.json'], /hello \ w+/g)
  .on('fileread', file => console.log(file + 'was read'))
  .on('found', (file, match) => console.log(match, 'in file ' + file))
  .on('error', err => console.log(err.message))


// once 

// removeListener
class FindPattern extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);
    return this;
  }

  find() {
    this.files.forEach(file => {
      fs.readFile(file, 'utf8', (err, content) => {
        if(err) {
          return this.emit('error', err);
        }
        this.emit('fileread', file);
        let match = null;
        if(match = content.match(this.regex)) {
          match.forEach(elem => this.emit('found', file, elem));
        }
      })
    });
    return this;
  }
}

class SyncEmit extends EventEmitter {
  constructor() {
    super();
    this.emit('ready');
  }
}

const syncEmit = new SyncEmit();
syncEmit.on('ready', () => console.log('Object is ready'));

function helloEvents () {
  const eventEmitter = new EventEmitter();
  setTimeout(() => eventEmitter.emit('hello', 'hello world'), 100);
  return eventEmitter;
}

function helloCallback (callback) {
  setTimeout(() => callback('hello world'), 100);
};

