function* foo() {
  var index = 0;
  while(index <= 2) {
    yield index++;
  }
};

// var iterator = foo();

// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());


// function* generator (arr) {
//   for(let i = 0; i < arr.length; i++) {
//     yield arr[i];
//   }
// };

// const bar = generator([1, 2, 3, 4, 5, 6]);

// let item = bar.next();
// while(!item.done) {
//   console.log(item.value);
//   item = bar.next()
// }

function* iteratorGenerator(arr) {
  for(let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
};

const iterator = iteratorGenerator([1, 2, 3]);
let currentItem = iterator.next();

while(!currentItem.done) {
  console.log(currentItem.value);
  currentItem = iterator.next();
}

function* twoWayGenerator() {
  const what = yield null;
  console.log('hello ' + what);
};

const twoWay = twoWayGenerator();

twoWay.next();
twoWay.next('world')