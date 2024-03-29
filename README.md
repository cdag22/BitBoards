# JavaScript & TypeScript BitBoard Classes

[![Build Status](https://travis-ci.org/cdag22/BitBoards.svg?branch=master)](https://travis-ci.org/cdag22/BitBoards)

##### For calculations in boardgames. Contains an all purpose class, and two sub classes for chess and connect four

##### Has been extensively tested in node.js.

## Installation and Usage

```sh
npm install --save bitboards
```

```html
<script src="https://unpkg.com/bitboards@1.0.6/bitboards.min.js"></script>
```

## Importing

**node.js**
```JavaScript
// Node
const { BitBoard, ChessBitBoard, ConnectFourBitBoard } = require('bitboards');
const board = new BitBoard();
```

**modules**
```JavaScript
import { BitBoard, ChessBitBoard, ConnectFourBitBoard } from 'bitboards';
const board = new BitBoard();
```

**unpkg**
```JavaScript
// index.html
<script src="https://unpkg.com/bitboards@1.0.6/bitboards.min.js"></script>

// file.js
const board = new BitBoard();
```
## BitBoard

#### NOTE

The last parameter to all binary operator methods is an [optional] boolean flag ```modify```. When true the BitBoard calling the method will be modified as opposed to leaving the calling BitBoard unchanged and returning a new BitBoard. If a BitBoard is an argument to a method it is ALWAYS left unchanged.

#### Constructor BitBoard( [optional array of two integers ])

- Takes in an array of two numbers n where 0 <= n <= 2 ^ 32 - 1.
- Or a binary string of up to 64 zeros and ones

*Array<number> Input*

```JavaScript
let boardA = new BitBoard();
let boardB = new BitBoard([Math.pow(2,32) - 1, Math.pow(2, 32) - 1]);

// boardA.board --> [0, 0]
// boardB.board --> [4294967295, 4294967295]

boardA.length // --> 64
boardB.length === boardA.length // --> true
```

*String Input*

```JavaScript
let boardA = new BitBoard('11111111');
let boardB = new BitBoard('1111111111111111111111111111111100000000000000000000000000000000');

// boardA.board --> [0, 65535];
// boardB.board --> [4294967295, 0]

let boardC = new BitBoard('1010101a') // --> Error
```

#### board.toString()

```JavaScript
let board = BitBoard([Math.pow(2,32) - 1, 0]);
board.toString();
// length = 64
// --> "1111111111111111111111111111111100000000000000000000000000000000"
```

#### board.getIndex(n)

```JavaScript
let board = BitBoard([Math.pow(2,32) - 1, 0]);

board.getIndex(0) // --> 0
board.getIndex(63) // --> 1
board.getIndex(64) // --> RangeError
```

#### board.copy()

```JavaScript
let board = BitBoard([Math.pow(2,32) - 1, 0]);
let copyBoard = board.copy();

board.board === copyBoard.board // --> false
```

#### board.isEmpty()

```JavaScript
let board = new BitBoard([Math.pow(2,32) - 1, 0]);
let defaultBoard = new BitBoard();

board.isEmpty() // --> false
defaultBoard.isEmpty() // --> true
```

#### board.and(bitBoard, [modify])

```JavaScript
let boardA = new BitBoard();
// --> "0000000000000000000000000000000000000000000000000000000000000000"

let boardB = new BitBoard([Math.pow(2,32) - 1, Math.pow(2,32) - 1]);
// --> "1111111111111111111111111111111111111111111111111111111111111111"

boardA.and(boardB)
// --> "0000000000000000000000000000000000000000000000000000000000000000"
```

#### board.or(bitBoard, [modify])

```JavaScript
let boardA = new BitBoard();
// --> "0000000000000000000000000000000000000000000000000000000000000000"

let boardB = new BitBoard([Math.pow(2,32) - 1, Math.pow(2,32) - 1]);
// --> "1111111111111111111111111111111111111111111111111111111111111111"

boardA.or(boardB)
// --> "1111111111111111111111111111111111111111111111111111111111111111"
```

#### board.xOr(bitboard, [modify])

```JavaScript
let boardA = new BitBoard();
// --> "0000000000000000000000000000000000000000000000000000000000000000"

let boardB = new BitBoard([Math.pow(2,32) - 1, Math.pow(2,32) - 1]);
// --> "1111111111111111111111111111111111111111111111111111111111111111"


boardA.xOr(boardB)
// --> "1111111111111111111111111111111111111111111111111111111111111111"
```

#### board.orNumber(shiftAmount, num, [modify])

```JavaScript
let board = new BitBoard([Math.pow(2, 32) - 1, 0]);
// --> "1111111111111111111111111111111100000000000000000000000000000000"

board.orNumber(5, 10);
// --> "1111111111111111111111111111111100000000000000000000000101000000"
```

#### board.xOrNumber(shiftAmount, num, [modify])

```JavaScript
let board = new BitBoard([Math.pow(2, 32) - 1, Math.pow(2,32) - 1]);
// --> "1111111111111111111111111111111111111111111111111111111111111111"

board.xOrNumber(2, 10);
// --> "1111111111111111111111111111111111111111111111111111111111010111"
```

#### board.not([modify])

```JavaScript
let board = new BitBoard([Math.pow(2, 32) - 1, Math.pow(2,32) - 1]);
// --> "1111111111111111111111111111111111111111111111111111111111111111"

board.not()
// --> "0000000000000000000000000000000000000000000000000000000000000000"
```

#### board.shiftLeft(shiftAmount, [modify])

```JavaScript
let board = new BitBoard([0, Math.pow(2, 32) - 1]);
// --> "0000000000000000000000000000000011111111111111111111111111111111"

board.shiftLeft(54)
// --> "1111111111000000000000000000000000000000000000000000000000000000"
```

#### board.shiftRight(shiftAmount, [modify])

```JavaScript
let board = new BitBoard([Math.pow(2, 32) - 1, 0]);
// --> "1111111111111111111111111111111100000000000000000000000000000000"

board.shiftRight(54);
// --> "0000000000000000000000000000000000000000000000000000001111111111"
```

#### board.flipVertical([modify])

```JavaScript
let board = new BitBoard([65535, 0]);
// --> "0000000000000000111111111111111100000000000000000000000000000000"

board.flipVertical()
// --> "0000000000000000000000000000000011111111111111110000000000000000"
```

#### board.flipDiagonal([modify])

```JavaScript
let board = new BitBoard([65535, 0]);
// --> "0000000000000000111111111111111100000000000000000000000000000000"

board.flipDiagonal()
// --> "0000110000001100000011000000110000001100000011000000110000001100"
```

#### board.rotate180Degrees([modify])

```JavaScript
let board = new BitBoard([65535, 0]);
// --> "0000000000000000111111111111111100000000000000000000000000000000"

board.rotate180Degrees()
// --> "0000000000000000000000000000000011111111111111110000000000000000"
```

#### board.rotate90DegreesClockwise([modify])
```JavaScript
let board = new BitBoard([16711935,0]);
// --> "0000000011111111000000001111111100000000000000000000000000000000"

board.rotate90DegreesClockwise()
// --> "0000101000001010000010100000101000001010000010100000101000001010"
```

## ChessBitBoard

```JavaScript
let whiteA1Orientation = new ChessBitBoard({ boardType: "white", lsb: "a1" });

let blackA8Orientation = new ChessBitBoard({ boardType: "black" });

// --> whiteA1Orientation.board = [0, 65535] = blackA8Orientation

```

***boardType***: string *[optional]* 
- Valid inputs are:
     "black", "white", "piece", "pawn", "knight", "bishop", "rook", "queen", "king"

**board**: Array<number> *[optional]*

- With length = 2
- Each number n must satisfy: 0 <= n <= 2 ^ 32 - 1 (i.e. the largest 32 digit binary number)

**lsb**: string *[optional]*
- Represents the square for the Least Significant Bit. Default is "a8". Only valid input is "a1".
- The difference between "a1" and default is that boards for "white" and "black" swap.
     

**NOTE ON ARGUMENTS**
- if boardType is present, board is ignored
- boardType must be "white" or "black" for lsb to take affect
- if neither boardType or board are present, ChessBitBoard.board = [0, 0]

**SHAPE OF DEFAULT BOARDS**

All default boards are based on the the starting positions for pieces according to the following mapping of squares to indicies. NOTE only "white" and "black" change if lsb is set to "a1".

|   a    |    b   |    c   |    d   |    e   |    f   |    g   |    h   |
|:------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:| 
| a8: 0  | b8: 1  | c8: 2  | d8: 3  | e8: 4  | f8: 5  | g8: 6  | h8: 7  |
| a7: 8  | b7: 9  | c7: 10 | d7: 11 | e7: 12 | f7: 13 | g7: 14 | h7: 15 |
| a6: 16 | b6: 17 | c6: 18 | d6: 19 | e6: 20 | f6: 21 | g6: 22 | h6: 23 |
| a5: 24 | b5: 25 | c5: 26 | d5: 27 | e5: 28 | f5: 29 | g5: 30 | h5: 31 |
| a4: 32 | b4: 33 | c4: 34 | d4: 35 | e4: 36 | f4: 37 | g4: 38 | h4: 39 |
| a3: 40 | b3: 41 | c3: 42 | d3: 43 | e3: 44 | f3: 45 | g3: 46 | h3: 47 |
| a2: 48 | b2: 49 | c2: 50 | d2: 51 | e2: 52 | f2: 53 | g2: 54 | h2: 55 |
| a1: 56 | b1: 57 | c1: 58 | d1: 59 | e1: 60 | f1: 61 | g1: 62 | h1: 63 |

## ConnectFourBitBoard

BitBoard class with an ```isWin()``` **static** method.

*Special thanks to **denkspuren** for [isWin logic and the following diagram](https://github.com/denkspuren/BitboardC4/blob/master/BitboardDesign.md).*

**SHAPE OF CONNECT FOUR GAME**
```
  6 13 20 27 34 41 48   55 62     Additional row
+---------------------+ 
| 5 12 19 26 33 40 47 | 54 61     top row
| 4 11 18 25 32 39 46 | 53 60
| 3 10 17 24 31 38 45 | 52 59
| 2  9 16 23 30 37 44 | 51 58
| 1  8 15 22 29 36 43 | 50 57
| 0  7 14 21 28 35 42 | 49 56 63  bottom row
+---------------------+
```

#### isWin(connectFourBitBoard)

```JavaScript
const northWestToSouthEastWinBoard = new ConnectFourBitBoard([0, 2130440]);
// --> "0000000000000000000000000000000000000000001000001000001000001000"
// --> 1s at [3, 9, 15, 21]

ConnectFourBitBoard.isWin(northWestToSouthEastWinBoard);
// --> true
```