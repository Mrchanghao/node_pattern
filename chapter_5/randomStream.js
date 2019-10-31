// 임의의 문자열을 생성하는 스트림을 구현하는 클래스

const stream = require('stream');
const Chance = require('chance');
const chance = new Chance();

class RandomStream extends stream.Readable {
  constructor(options) {
    super(options);
  }
  _read(size) {
    const chunk = chance.string();
    console.log(`pushing chunk of size ${chunk.length}`);

    this.push(chunk, 'utf8');

    if(chance.bool({likelihood: 5})) {
      this.push(null)
    }
  }
};

module.exports = RandomStream;