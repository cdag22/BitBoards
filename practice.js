function shiftLeft(shiftAmount, arr) {
        
  const bitMask = ((2 ** shiftAmount - 1) << (32 - shiftAmount)) >>> 0;
  const carryDigits = ((arr[1] & bitMask) >>> 0) >>> (32 - shiftAmount);

  if (shiftAmount === 32) {
    arr[1] = 0;
    arr[0] = carryDigits;
  } else {
    arr[1] = (arr[1] << shiftAmount) >>> 0;
    arr[0] = (((arr[0] << shiftAmount) >>> 0) | carryDigits) >>> 0;
  }

  return arr;
}

function shiftRight(shiftAmount, arr) {
  const bitMask = ((2 ** shiftAmount - 1) << (32 - shiftAmount)) >>> 0;
  const carryDigits = ((arr[0] << (32 - shiftAmount) >>> 0) & bitMask) >>> 0;

  if (shiftAmount === 32) {
    arr[0] = 0;
    arr[1] = carryDigits;
  } else {
    arr[0] = (arr[0] >>> shiftAmount) >>> 0;
    arr[1] = ((arr[1] >>> shiftAmount) | carryDigits) >>> 0;
  }
  return arr;
}

function orNumber(shiftAmount, num, arr) {
  const startDigits = (((num << shiftAmount) >>> 0) & (2 ** 32 - 1)) >>> 0;
  const startDigitMask = (startDigits & (2 ** 32 - 1)) >>> 0;
  const numCarryDigits = (num >>> (32 - shiftAmount)) >>> 0;

  if (shiftAmount === 32) {
    arr[0] = (arr[0] | num) >>> 0;
  } else if (shiftAmount === 0) {
    arr[1] = (arr[1] | startDigitMask) >>> 0;
  } else {
    arr[1] = (arr[1] | startDigitMask) >>> 0;
    arr[0] = (arr[0] | numCarryDigits) >>> 0;
  }

  return arr;
}

function xOrNumber(shiftAmount, num, arr) {
  const startDigits = (((num << shiftAmount) >>> 0) & (2 ** 32 - 1)) >>> 0;
  const startDigitMask = (startDigits & (2 ** 32 - 1)) >>> 0;
  const numCarryDigits = (num >>> (32 - shiftAmount)) >>> 0;

  if (shiftAmount === 32) {
    arr[0] = (arr[0] ^ num) >>> 0;
  } else if (shiftAmount === 0) {
    arr[1] = (arr[1] ^ startDigitMask) >>> 0;
  } else {
    arr[1] = (arr[1] ^ startDigitMask) >>> 0;
    arr[0] = (arr[0] ^ numCarryDigits) >>> 0;
  }

  return arr;
}

function boardToString(arr) {
  let str = '';
  arr.forEach(x => str += x.toString(2).padStart(32,'0') + '|');
  return str;
}

// for (let i = 0; i <= 32; i++) {
//   let arr = [2**i - 1, 2**i - 1];
//   let num = 4;
//   let shifted = shiftLeft(num, arr.slice());
//   console.log(`${boardToString(arr)} | ${num.toString(2).padStart(32, '0')} ${boardToString(shifted)} | ${i}`)
// }




/**
 * TESTING SPEEDS
 */
var one = () => (429496295 & (2 ** 32 - 1)) >>> 0;
var two = () => (429496295 & (0xFFFFFF)) >>> 0;
var three = () => (429496295 & (Math.pow(2, 32) - 1)) >>> 0;
var timeIt = (func) => {
  var t1 = performance.now();
  func();
  var t2 = performance.now();
  return t2 - t1;
};
var getMean = (func, bound = 100000) => {
  var mean = [];
  for (let i = 0; i < bound; i++) {
    mean.push(timeIt(func))
  }
  return mean.reduce((cur, acc) => cur + acc, 0) / mean.length;
}
var means = () => {
  return Promise.all([getMean(one), getMean(two), getMean(three)]).then(([one, two, three]) => {
    let m = {
      [one]: 'one',
      [two]: 'two',
      [three]: 'three',
    };
    let min = Math.min(one, two, three);
    return m[min];
  });
}
var mode = (arr) => {
  let tracker = {};
  arr.forEach(x => tracker[x] = (tracker[x] || 0) + 1);
  let maxValue = Math.max(...Object.values(tracker));
  return Object.keys(tracker).reduce((key, acc) => tracker[key] === maxValue ? key : acc, '');
}
var manyMeans = (iter) => {
  Promise.all(Array.from({ length : iter }, (_,i) => means())).then((arr) => console.log(`After ${iter} iterations best = ${mode(arr)}`))
}
/**
 * RESULTS
 * 
 * manyMeans(1000)
 * After 1000 iterations best = three
 */
