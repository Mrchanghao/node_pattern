// 블로킹
// 햔제 작업이 완료 될때만 다음 작업이 실행 가능
// 비동기에서는 보류 중인 작업이 이전 작업이 아직 완료 되지 않았을때도 일부 작업을 백그라운드로 실행 가능
// CPS (연속전달방식)
function add(a, b, cb) {
  cb(a + b);
}

// use
console.log('before')
add(1,2, result => console.log(result));
console.log('after');

// 비동기 cps 
function additionAsync(a, b, cb) {
  setTimeout(() => {
    cb(a + b)
  }, 100);
};

console.log('before');
additionAsync(1, 2, result => console.log(result));
console.log('after')

// 비연속 전달 방식 
// none CPS   
const result = [1, 3, 5].map(el => el + 3); // 콜백은 요소를 반복하는데 사용될 뿐 연산 결과를 전달하지 않음

// example
const fs = require('fs');
const cache = {};
function inconsistenRead(filename, callback) {
  
  if(cache[filename]) {
    // return cache[filename];
    process.nextTick(() => callback(cache[filename]))
  } else {
      fs.readFile(filename, 'utf8', (err, data) => {
      cache[filename] = data;
      callback(data);
  });
};
}

function createFileReader(filename) {
  const listeners = [];
  inconsistenRead(filename, value => {
    listeners.forEach(listener => listener(value))
  });

  return {
    onDataReady: listener => listeners.push(listener) 
  }
}

const reader1 = createFileReader('data.txt');
reader1.onDataReady(data => {
  console.log('First call data: ' + data);

  const reader2 = createFileReader('data.txt');
  reader2.onDataReady(data => {
    console.log('second call data: ' + data)
  })
});

function readJSON(filename, callback) {
  fs.readFile(filename, 'utf8', (err, data) => {
    let parsed;
    if(err) {
      return callback(err);
    }
    try {
      parsed = JSON.parse(data);
    } catch (err) {
      return callback(err)
    }
    callback(null, parsed);
  })
}