// 노출식 모듈
const fs = require('fs')
const pattern = (() => {
  const pivateFoo = () => {};
  const privateBar = [];

  const exported = {
    publicFoo: () => {},
    publicBar: () => {}
  };

  return exported;

})();

console.log(pattern);

function loadModule (filename, module, require) {
  const wrappedSrc = `(function(module, exports, require) {
    ${fs.readFileSync(filename, 'utf8')}
  })(module, module.exports, require);`;
  eval(wrappedSrc);
}
// console.log('dkfald');

const require = (moduleName) => {
  console.log(`require invoked for module: ${moduleName}`);
  const id = require.resolve(moduleName);
  if(require.cache[id]) {
    return require.cache[id].exports;
  }
  const module = {
    exports: {},
    id
  };
  require.cache[id] = module;

  loadModule(id, module, require);

  return module.exports;
};
require.cache = {};
require.resolve = (moduleName) => {

}

const dependency = require('./callback');

function log() {
  console.log(`well done ${dependency}`)
};

module.exports.run = () => {
  log();
}