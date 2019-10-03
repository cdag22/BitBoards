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

for (let i = 0; i <= 32; i++) {
  let arr = [2**i - 1, 2**i - 1];
  let num = 1;
  let shifted = xOrNumber(24,num, arr.slice());
  console.log(`${boardToString(arr)} | ${num.toString(2).padStart(32, '0')} ${boardToString(shifted)} | ${i}`)
}