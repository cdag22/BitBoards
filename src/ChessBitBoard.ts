import BitBoard from './BitBoard'

interface BitBoardInputDictionary {
  boardType?: string,
  board?: Array<number>,
  lsb?: string
}

/**
 * @author Cj D'Agostino
 * 
 * @class ChessBitBoard
 * @extends {BitBoard}
 * @param {input} object = { boardType, board, lsb }
 * @augments boardType : string [optional] 
 * Valid inputs are:
 *      "black", "white", "piece", "pawn", "knight", "bishop", "rook", "queen", "king"
 * @arguments board : Array<number> [optional]
 * With length = 2
 * Each number n must satisfy: 0 <= n <= 2 ^ 32 - 1 (i.e. the largest 32 digit binary number)
 * @arguments lsb: string [optional]
 * Represents the square for the Least Significant Bit. Default is 'undefined'. Only valid input is "a1".
 * The difference between "a1" and default is that boards for "white" and "black" swap.
 *      
 * 
 * NOTE ON ARGUMENTS
 *    if boardType is present, board is ignored
 *    boardType must be "white" or "black" for lsb to take affect
 *    if neither boardType or board are present, ChessBitBoard.board = [0, 0]
 * 
 * SHAPE OF DEFAULT BOARDS
 *    All default boards are based on the the starting positions for pieces according to the
 *    following mapping of squares to indicies:
 * 
 *    a8: 0,  b8: 1,  c8: 2,  d8: 3,  e8: 4,  f8: 5,  g8: 6,  h8: 7,
 *    a7: 8,  b7: 9,  c7: 10, d7: 11, e7: 12, f7: 13, g7: 14, h7: 15,
 *    a6: 16, b6: 17, c6: 18, d6: 19, e6: 20, f6: 21, g6: 22, h6: 23,
 *    a5: 24, b5: 25, c5: 26, d5: 27, e5: 28, f5: 29, g5: 30, h5: 31,
 *    a4: 32, b4: 33, c4: 34, d4: 35, e4: 36, f4: 37, g4: 38, h4: 39,
 *    a3: 40, b3: 41, c3: 42, d3: 43, e3: 44, f3: 45, g3: 46, h3: 47,
 *    a2: 48, b2: 49, c2: 50, d2: 51, e2: 52, f2: 53, g2: 54, h2: 55,
 *    a1: 56, b1: 57, c1: 58, d1: 59, e1: 60, f1: 61, g1: 62, h1: 63
 */

class ChessBitBoard extends BitBoard {

  constructor(input: BitBoardInputDictionary) {
    if (input && input.boardType) {
      switch (input.boardType) {
        case 'piece':
          super([4294901760, 65535]);
          break;
        case 'black':
          input.lsb === "a1" ? super([4294901760, 0]) : super([0, 65535]);
          break;
        case 'white':
          input.lsb === "a1" ? super([0, 65535]) : super([4294901760, 0]);
          break;
        case 'pawn':
          super([16711680, 65280]);
          break;
        case 'knight':
          super([1107296256, 66]);
          break;
        case 'bishop':
          super([603979776, 36]);
          break;
        case 'rook':
          super([2164260864, 129]);
          break;
        case 'queen':
          super([268435456, 16]);
          break;
        case 'king':
          super([134217728, 8]);
          break;
        default:
          throw new SyntaxError('Input is not a valid value for boardType. Must be one of the following:\n\t"black", "white", "piece", "pawn", "knight", "bishop", "rook", "queen", "king"');
      }
    } else if (input && input.board) {
        super(input.board); // this.board = custom input
    } else {
      super(); // this.board = [0, 0];
    }
  }
}

export = ChessBitBoard;