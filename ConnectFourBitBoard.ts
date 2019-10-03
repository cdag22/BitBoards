import BitBoard = require("./BitBoard");

/**
 * @author Cj D'Agostino
 * 
 * @class ConnectFourBitBoard
 * @extends BitBoard
 * 
 * @param board : [optional] Array<number>
 * With length = 2
 * Each number n must satisfy: 0 <= n <= 2 ^ 32 - 1 (i.e. the largest 32 digit binary number)
 */

class ConnectFourBitBoard extends BitBoard {

  constructor(board: Array<number> = [0, 0]) {
    super(board);
  }

  /**
   * @param bb : ConnectFourBitBoard for a team, i.e. BitBoard for 'X' or "O"
   * 
   * Calculates whether the given team has won
   */
  public static isWin(bb: ConnectFourBitBoard): boolean {
    const directions: Array<number> = [1, 7, 6, 8];

    for (let direction of directions) {
      let firstShift: BitBoard = bb.shiftRight(2 * direction);
      let secondShift: BitBoard = bb.shiftRight(3 * direction);

      const result: BitBoard = bb.and(bb.shiftRight(direction)).and(firstShift).and(secondShift);

      if (!result.isEmpty()) return true;
    }
    return false;
  }
}

export = ConnectFourBitBoard;