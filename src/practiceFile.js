function shiftLeft(shiftAmount, arr) {
  const bitMask = ((2 ** shiftAmount - 1) << (32 - shiftAmount)) >>> 0;
  const carryDigits = ((arr[1] & bitMask) >>> 0) >>> (32 - shiftAmount);

  if (shiftAmount === 32) {
    arr[1] = 0;
    arr[0] = carryDigits;
  } else {
    arr[1] = ((arr[1] << shiftAmount) >>> 0) //% (2 ** 32 - 1);
    arr[0] = ( ( ((arr[0] << shiftAmount) >>> 0)  ) | carryDigits ) >>> 0;
  }

  return arr;
}

function boardToString(arr) {
  let str = '';
  arr.forEach(n => str += (n >>> 0).toString(2).padStart(32, '0'))
  return str;
}

for (let i = 0; i <= 32; i++) {
  let arr = [2** i - 1, 2** i - 1];
  let out = shiftLeft(0, arr.slice());
  console.log(`${boardToString(arr)} | ${boardToString(out)} | ${i}`);
}