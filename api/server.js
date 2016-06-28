function* jsRocksIsAwesome() {
  yield 'JS Rocks is Awesome';
  yield 'JS Rocks says JavaScript Rocks';
  return 'because JavaScript really rocks';
}

const jsRocks = jsRocksIsAwesome();

console.log(jsRocks.next());
console.log(jsRocks.next());
console.log(jsRocks.next());
