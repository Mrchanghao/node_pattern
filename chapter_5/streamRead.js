
// process.stdin
//   .on('readable', () => {
//     let chunk;
//     console.log('new data 사용 가능');
//     while((chunk = process.stdin.read()) !== null) {
//       console.log(`Chunk read: ${chunk.length}, ${chunk.toString()}`)
//     };
//   })
//   .on('end', () => process.stdout.write('end of stream'))

process.stdin
  .on('data', chunk => {
    console.log('new data');
    console.log(`Chunk read ${chunk.length} "${chunk.toString()}"`);

  })
  .on('end', () => process.stdout.write('end of stream'))