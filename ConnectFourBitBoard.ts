import BitBoard = require(".");

/**
 * @class ConnectFourBitBoard
 * @extends BitBoard
 * @author Cj D'Agostino
 * 
 * @param board : [optional] Array<number>
 * With length = 2
 * Each number n must satisfy: 0 <= n <= 2 ^ 32 - 1 (i.e. the largest 32 digit binary number)
 */

class ConnectFourBitBoard extends BitBoard {

  constructor(board: Array<number> = [0, 0]) {
    super(board);
  }

  public static isWin(bitBoard: ConnectFourBitBoard): boolean {
    const directions: Array<number> = [1, 7, 6, 8];

    for (let direction of directions) {
      let firstShift: BitBoard = bitBoard.shiftRight(2 * direction);
      let secondShift: BitBoard = bitBoard.shiftRight(3 * direction);

      const result: BitBoard = bitBoard.and(bitBoard.shiftRight(direction)).and(firstShift).and(secondShift);

      if (!result.isEmpty()) return true;
    }
    return false;
  }

  public static generateAllMoves(): Array<number> {
    const top: ConnectFourBitBoard = new ConnectFourBitBoard([66052, 135274560]);
    let moves: Array<number> = [];

    for (let column: number = 0; column < 7; column++) {
      const height: Array<number> = [0, 7, 15, 24, 30, 35, 42];
      const heightBoard: ConnectFourBitBoard = new ConnectFourBitBoard([0, height[column]]);
      if (top.and(heightBoard.shiftLeft(1)).isEmpty()) {
        moves.push(column);
      }
    }
    return moves;
  }
}

export = ConnectFourBitBoard;