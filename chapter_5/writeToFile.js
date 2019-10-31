const ToFileStream = require('./toFileStream');
const tfs = new ToFileStream();

tfs.write({path: 'file1.txt', content: 'hello'})
tfs.write({path: 'file2.txt', content: 'node.js is fuck \n hello'})
tfs.end(() => console.log('all files created'))