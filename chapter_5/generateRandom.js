const RandomStream = require('./randomStream');
const randomStream = new RandomStream();

randomStream.on('read', () => {
  let chunk;
  while((chunk =  randomStream.read()) !== null) {
    console.log(`chunk received: ${chunk.toString()}`)
  }
})