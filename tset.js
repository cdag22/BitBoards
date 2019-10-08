const { BitBoard } = require('./bitboards');

let board = new BitBoard([0, 65535]);

console.log(board.toString());
console.log(board.flipDiagonalA8H1().toString());