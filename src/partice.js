function shiftLeft(shiftAmount, arr) {

  const bitMask = ((2** shiftAmount - 1) << (32 - shiftAmount)) >>> 0;
  const carryDigits = ((arr[1] & bitMask) >>> 0) >>> (32 - shiftAmount);

  if (shiftAmount === 32) {
    arr[1] = 0;
    arr[0] = carryDigits;
  } else {
    arr[1] = ((arr[1] << shiftAmount) >>> 0) % (2 ** 32 - 1);
    arr[0] = ( ( ((arr[0] << shiftAmount) >>> 0) % (2 ** 32 - 1) ) | carryDigits ) >>> 0;
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

function padString(str, length, padValue, start) {
  if (start) {
    for (let i = str.length; i < length; i++) {
      str = padValue + str;
    }
  } else {
    for (let i = str.length; i < length; i++) {
      str += padValue;
    }
  }

  return str;
}

function boardToString(board) {
  let str = '';

  for (let i = 0; i < board.length; i++) {

    str += padString((board[i] >>> 0).toString(2), 32, '0', true);
    str +='|'
  }
  return str;
}

// for (let i = 0; i <= 32; i++) {
//   let arr = [ 2**i - 1, (2**i) - 1 ];
//   let shift = 1;
//   let after = shiftRight(shift, arr.slice());
//   console.log(`shift = ${shift} | before = ${boardToString(arr)} | after = ${boardToString(after)} x = ${after}`)
// }
const zero = '0'.repeat(8)
const pawn = '1'.repeat(8)
const s = pawn + pawn + '0'.repeat(16) 
const n = parseInt((s), 2)
console.log(n)