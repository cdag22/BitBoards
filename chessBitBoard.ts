import BitBoard = require(".");

interface BitBoardInputDictionary {
  boardType?: string,
  board?: Array<number>
}

/**
 * @class ChessBitBoard
 * @extends BitBoard
 * @author Cj D'Agostino
 * 
 * @param input : object = { [optional]: boardType, [optional] board }
 * 
 * @augments boardType : [optional] string equal to one of the following:
 *      "black", "white", "piece", "pawn", "knight", "bishop", "rook", "queen", "king"
 * 
 * @arguments board : [optional] Array<number>
 * With length = 2
 * Each number n must satisfy: 0 <= n <= 2 ^ 32 - 1 (i.e. the largest 32 digit binary number)
 * 
 * NOTE:
 *    if boardType is present, board is ignored
 *    if neither boardType or board are present, BitBoard.board = [0, 0]
 */

class ChessBitBoard extends BitBoard {

  constructor(input: BitBoardInputDictionary) {
    if (input.boardType) {
      switch (input.boardType) {
        case 'piece':
          super([4294901760, 65535]);
          break;
        case 'black':
          super([0, 65535]);
          break;
        case 'white':
          super([4294901760, 0]);
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
    } else if (input.board) {
        super(input.board); // this.board = custom input
    } else {
      super(); // this.board = [0, 0];
    }
  }
}

export = ChessBitBoard;